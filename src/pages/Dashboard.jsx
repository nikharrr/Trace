import { useEffect, useRef, useState } from "react";
import JourneyLane from "../components/JourneyLane";

const journeys = [
  { id: 1, title: "Fitness", video: "src/assets/161071-822582138_medium.mp4" },
  { id: 2, title: "Travel", video: "src/assets/7824464-uhd_2160_3840_30fps.mp4" },
  { id: 3, title: "Study", video: "src/assets/12087049_1080_1920_60fps.mp4" },
  { id: 4, title: "Coding", video: "src/assets/12376890_1440_2560_30fps.mp4" },
  { id: 5, title: "Reading", video: "src/assets/13182629_2160_3840_24fps.mp4" },
];

export default function Dashboard() {
  const scrollRef = useRef(null);
  const videoRefs = useRef([]);
  const laneRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollLeft = () => {
    const nextIndex = activeIndex === 0 ? 0 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const scrollRight = () => {
    const nextIndex =
      activeIndex === journeys.length - 1 ? journeys.length - 1 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });

    const currentLane = laneRefs.current[activeIndex];
    if (currentLane) {
      currentLane.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  const handleVideoEnd = () => {
    if (activeIndex < journeys.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      setActiveIndex(0);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* navbar */}
      <div className="absolute inset-x-0 top-0 z-30">
        <div className="bg-gradient-to-b from-black/85 via-black/55 to-transparent">
          <div className="flex h-20 items-center justify-between px-6 md:px-10">
            <div className="flex items-center gap-8">
              <h1 className="text-3xl font-extrabold tracking-wide text-white">
                TRACE
              </h1>

              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
                <button className="hover:text-white">Home</button>
                <button className="hover:text-white">Journeys</button>
                <button className="hover:text-white">Explore</button>
                <button className="hover:text-white">My List</button>
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

     
      {/* arrows */}
      <button
        onClick={scrollLeft}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 text-5xl text-white/70 hover:text-white"
      >
        ‹
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 text-5xl text-white/70 hover:text-white"
      >
        ›
      </button>

      {/* lanes */}
      <div
        ref={scrollRef}
        className="flex h-screen w-full overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {journeys.map((journey, index) => (
          <div
            key={journey.id}
            ref={(el) => (laneRefs.current[index] = el)}
            className="h-full"
          >
            <JourneyLane
              title={journey.title}
              video={journey.video}
              isActive={index === activeIndex}
              onEnded={index === activeIndex ? handleVideoEnd : undefined}
              videoRef={(el) => (videoRefs.current[index] = el)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}