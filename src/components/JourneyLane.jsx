import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { loopFirstSeconds } from "../utils/videoPlayback";

const LANE_COVER_FRAME_SECONDS = 1;

export default function JourneyLane({ id, video, image, title }) {
  const laneRef = useRef(null);
  const localVideoRef = useRef(null);
  const coverFrameRef = useRef(0);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!video || shouldLoadVideo) return;

    const node = laneRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.unobserve(node);
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [video, shouldLoadVideo]);

  const handleMouseEnter = () => {
    if (!video) return;
    setShouldLoadVideo(true);
    const playPromise = localVideoRef.current?.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (localVideoRef.current) {
      localVideoRef.current.pause();
      localVideoRef.current.currentTime = coverFrameRef.current;
    }
  };

  const handleLoadedMetadata = () => {
    const videoEl = localVideoRef.current;
    if (!videoEl) return;

    const maxSeekTime = Math.max(0, (videoEl.duration || LANE_COVER_FRAME_SECONDS) - 0.1);
    const coverFrameTime = Math.min(LANE_COVER_FRAME_SECONDS, maxSeekTime);
    coverFrameRef.current = coverFrameTime;
    videoEl.currentTime = coverFrameTime;
  };

  const handleClick = () => {
    navigate(`/journey`, {
      state: { id, video, image, title },
    });
  };

  return (
    <motion.div
      ref={laneRef}
      layout
      layoutId={`journey-card-${id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative h-full flex-1 overflow-hidden border-r border-white/20 cursor-pointer"
      initial={false}
      whileHover={reduceMotion ? undefined : { flexGrow: 2.8 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              layout: { type: "spring", stiffness: 170, damping: 24, mass: 0.8 },
              default: { type: "spring", stiffness: 190, damping: 22, mass: 0.8 },
            }
      }
      style={{ flexGrow: 1, flexBasis: 0, willChange: "flex-grow" }}
    >
      <motion.video
        layoutId={`journey-video-${id}`}
        ref={localVideoRef}
        src={shouldLoadVideo ? video : undefined}
        poster={image}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        muted
        playsInline
        preload={shouldLoadVideo ? "metadata" : "none"}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={(event) =>
          loopFirstSeconds(event, undefined, coverFrameRef.current)
        }
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 170, damping: 26, mass: 0.9 }
        }
      />

      <motion.div
        className="absolute inset-0 bg-black/40"
        whileHover={reduceMotion ? undefined : { opacity: 0.22 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }}
      />
    </motion.div>
  );
}
