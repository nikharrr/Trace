import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";

const JOURNEY_PREVIEW_STOP_SECONDS = 3;

export default function Journey() {
  const { state } = useLocation();
  const videoRef = useRef(null);

  const id = state?.id;
  const video = state?.video;
  const image = state?.image;
  const title = state?.title || "Journey";

  const [showHalfImageLayout, setShowHalfImageLayout] = useState(false);

  const handleSkip = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.pause();
    }
    setShowHalfImageLayout(true);
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      if (
        videoEl.currentTime >= JOURNEY_PREVIEW_STOP_SECONDS &&
        !showHalfImageLayout
      ) {
        videoEl.pause();
        setShowHalfImageLayout(true);
      }
    };

    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [showHalfImageLayout]);

  if (!id || !video) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        Journey not found
      </div>
    );
  }

  return (
    <motion.div
      layoutId={`journey-card-${id}`}
      className="relative h-screen w-screen overflow-hidden bg-black text-white"
    >
      {!showHalfImageLayout ? (
        <>
          <div className="absolute right-5 top-5 z-20">
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-full border border-white/60 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-black/45"
            >
              Skip
            </button>
          </div>

          <motion.video
            ref={videoRef}
            layoutId={`journey-video-${id}`}
            src={video}
            poster={image}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
          />
        </>
      ) : (
        <div className="flex h-full w-full flex-col bg-black">
          {/* top half image */}
          <motion.div
            initial={{ height: "100vh" }}
            animate={{ height: "50vh" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full overflow-hidden"
          >
            <img
              src={image}
              alt="Journey cover"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

            <div className="absolute bottom-6 left-6 z-10">
              <h1 className="text-4xl font-bold">{title}</h1>
            </div>
          </motion.div>

          {/* bottom half content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex h-[50vh] w-full items-center justify-center px-6"
          >
            <div className="max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-semibold">Your Journey Space</h2>
              <p className="text-white/70">
                Add your journey details, milestones, notes, stats, or cards here.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
