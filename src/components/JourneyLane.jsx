import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function JourneyLane({
  title,
  video,
  isActive,
  onEnded,
  videoRef,
}) {
  const localVideoRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    localVideoRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (localVideoRef.current) {
      localVideoRef.current.pause();
      localVideoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    navigate("/journey");
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative h-full w-[20vw] shrink-0 overflow-hidden border-r border-white/20 
      transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
      brightness-80 hover:brightness-100 hover:w-[40vw] cursor-pointer"
    >
      <video
        ref={localVideoRef}
        src={video}
        className="h-full w-full object-cover"
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/40 hover:bg-black/10 transition-all duration-300" />
    </div>
  );
}