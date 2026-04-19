import { useEffect, useState } from "react";
import JourneyLane from "../components/JourneyLane";
import { loopFirstSeconds } from "../utils/videoPlayback";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/SupabaseClient";

export default function Dashboard() {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState([]);
  const [loadingJourneys, setLoadingJourneys] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadJourneys = async () => {
      setLoadingJourneys(true);
      setLoadError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!isActive) return;
        setJourneys([]);
        setLoadingJourneys(false);
        return;
      }

      const { data, error } = await supabase
        .from("journeys")
        .select("id, title, cover_video, cover_image, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!isActive) return;

      if (error) {
        setLoadError(error.message);
        setJourneys([]);
        setLoadingJourneys(false);
        return;
      }

      const mappedJourneys = (data || []).map((item) => ({
        id: item.id,
        title: item.title || "Journey",
        video: item.cover_video || "",
        image: item.cover_image || "",
      }));

      setJourneys(mappedJourneys.filter((item) => item.video));
      setLoadingJourneys(false);
    };

    loadJourneys();

    return () => {
      isActive = false;
    };
  }, []);

  const sections = [];
  for (let i = 0; i < journeys.length; i += 4) {
    sections.push(journeys.slice(i, i + 4));
  }

  return (
    <div className="bg-black text-white">
      {/* navbar */}
      <div className="absolute inset-x-0 top-0 z-30">
        <div className="bg-gradient-to-b from-black/85 via-black/55 to-transparent">
          <div className="flex h-20 items-center justify-between px-6 md:px-10">
            <div className="flex items-center gap-8">
              <h1 className="text-3xl font-extrabold tracking-wide text-white">
                TRACE
              </h1>

              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
                
                <button className="hover:text-white">My List</button>
                <button
                  className="hover:text-white"
                  onClick={() => navigate("/create-journey")}
                >
                  Create
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-white/90">
              <button className="hover:text-white">Search</button>
              <button className="hover:text-white">Notifications</button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                N
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* first screen */}
      <div className="h-screen flex overflow-hidden">
        {loadingJourneys ? (
          <div className="flex w-full items-center justify-center text-white/70">
            Loading journeys...
          </div>
        ) : sections[0]?.length ? (
          sections[0].map((j) => (
            <JourneyLane
              key={j.id}
              id={j.id}
              title={j.title}
              video={j.video}
              image={j.image}
            />
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-lg text-white/85">
              {loadError ? `Could not load journeys: ${loadError}` : "No journeys yet."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/create-journey")}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
            >
              Create your first journey
            </button>
          </div>
        )}
      </div>

      {/* remaining sections */}
      {sections.slice(1).map((group, index) => (
        <div key={index}>
          <div className="relative h-screen w-full">
            <video
              src={group[0].video}
              poster={group[0].image}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onTimeUpdate={loopFirstSeconds}
            />
          </div>

          <div className="h-screen flex overflow-hidden">
            {group.map((j) => (
              <JourneyLane
                key={j.id}
                id={j.id}
                title={j.title}
                video={j.video}
                image={j.image}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
