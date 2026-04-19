import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

const ORIGINALS_BUCKET =
  import.meta.env.VITE_SUPABASE_JOURNEY_BUCKET || "journey-originals";
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80";

export default function CreateJourney() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!videoFile) {
      setErrorMessage("Please select a video file.");
      return;
    }

    if (!videoFile.type.startsWith("video/")) {
      setErrorMessage("Selected file is not a valid video.");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage("Please sign in again to create a journey.");
        return;
      }

      const fallbackName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";
      const fallbackUsername =
        user.email || `user_${String(user.id).replace(/-/g, "").slice(0, 10)}`;

      // Ensure FK target exists (commonly journeys.user_id -> profiles.id).
      const { error: profileUpsertError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: fallbackName,
          username: fallbackUsername,
        },
        { onConflict: "id" }
      );

      if (profileUpsertError) {
        setErrorMessage(profileUpsertError.message);
        return;
      }

      const extension = videoFile.name.split(".").pop() || "mp4";
      const fileId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`;
      const storagePath = `${user.id}/${fileId}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(ORIGINALS_BUCKET)
        .upload(storagePath, videoFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        const isBucketMissing =
          uploadError.message?.toLowerCase().includes("bucket") &&
          uploadError.message?.toLowerCase().includes("not found");

        setErrorMessage(
          isBucketMissing
            ? `Storage bucket "${ORIGINALS_BUCKET}" was not found. Create this bucket in Supabase Storage or set VITE_SUPABASE_JOURNEY_BUCKET correctly.`
            : uploadError.message
        );
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(ORIGINALS_BUCKET)
        .getPublicUrl(storagePath);
      const coverVideoUrl = publicUrlData?.publicUrl || "";

      const { data: createdJourney, error: insertError } = await supabase
        .from("journeys")
        .insert({
          user_id: user.id,
          title,
          description,
          type: category,
          // Save direct URL so dashboard can play without per-item signing calls.
          cover_video: coverVideoUrl,
          cover_image: DEFAULT_COVER_IMAGE,
          is_public: false,
        })
        .select("id")
        .single();

      if (insertError) {
        setErrorMessage(insertError.message);
        return;
      }

      if (createdJourney?.id) {
        const { error: statusUpdateError } = await supabase
          .from("journeys")
          .update({ processing_status: "pending" })
          .eq("id", createdJourney.id);

        if (
          statusUpdateError &&
          !statusUpdateError.message.includes("processing_status")
        ) {
          console.warn("Processing status update failed:", statusUpdateError.message);
        }

        const { error: invokeError } = await supabase.functions.invoke(
          "process-journey-media",
          {
            body: {
              journeyId: createdJourney.id,
              sourceBucket: ORIGINALS_BUCKET,
              sourcePath: storagePath,
              trimSeconds: 5,
              frameAtSeconds: 1,
            },
          }
        );

        if (invokeError) {
          console.warn("Media processing function not invoked:", invokeError.message);
        }
      }

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Could not create journey right now. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-8 rounded-full border border-white/30 px-4 py-2 text-sm text-white/90 hover:border-white/60 hover:text-white"
        >
          Back
        </button>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Create Journey
        </h1>
        <p className="mt-3 text-white/70">
          Start a new journey and personalize it with your own focus.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label
              htmlFor="journey-title"
              className="mb-2 block text-sm font-medium text-white/90"
            >
              Journey Title
            </label>
            <input
              id="journey-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. 90-Day Fitness Sprint"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
              required
            />
          </div>

          <div>
            <label
              htmlFor="journey-category"
              className="mb-2 block text-sm font-medium text-white/90"
            >
              Category
            </label>
            <select
              id="journey-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black px-4 py-3 text-white outline-none focus:border-white/60"
            >
              <option>Personal</option>
              <option>Fitness</option>
              <option>Learning</option>
              <option>career</option>
              <option>Mindfulness</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="journey-video"
              className="mb-2 block text-sm font-medium text-white/90"
            >
              Upload Video
            </label>
            <input
              id="journey-video"
              type="file"
              accept="video/*"
              onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-sm file:font-semibold file:text-black"
              required
            />
            <p className="mt-2 text-xs text-white/55">
              We store the uploaded video, then generate a 5-second preview and cover image.
            </p>
            <p className="mt-1 text-xs text-white/40">
              Upload bucket: {ORIGINALS_BUCKET}
            </p>
          </div>

          <div>
            <label
              htmlFor="journey-description"
              className="mb-2 block text-sm font-medium text-white/90"
            >
              Description
            </label>
            <textarea
              id="journey-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="What does success look like for this journey?"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
            />
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}
