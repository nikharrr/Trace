import JourneyLane from "../components/JourneyLane";
import videoFitness from "../assets/161071-822582138_medium.mp4";
import videoTravel from "../assets/7824464-uhd_2160_3840_30fps.mp4";
import videoStudy from "../assets/12087049_1080_1920_60fps.mp4";
import videoCoding from "../assets/12376890_1440_2560_30fps.mp4";
import videoReading from "../assets/13182629_2160_3840_24fps.mp4";

const journeys = [
  { id: 1, title: "Fitness", video: videoFitness },
  { id: 2, title: "Travel", video: videoTravel },
  { id: 3, title: "Study", video: videoStudy },
  { id: 4, title: "Coding", video: videoCoding },
  { id: 5, title: "Reading", video: videoReading },
  { id: 6, title: "Coding", video: videoCoding },
  { id: 7, title: "Reading", video: videoReading },
  { id: 8, title: "Coding", video: videoCoding },
  { id: 9, title: "Reading", video: videoReading },
];

export default function Dashboard() {
  // split into groups of 4
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
                <button className="hover:text-white">Explore</button>
                <button className="hover:text-white">My List</button>
                <button className="hover:text-white">Create</button>
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
      
      {/* FIRST SCREEN (lanes) */}
      <div className="h-screen flex overflow-hidden">
        {sections[0]?.map((j) => (
          <JourneyLane key={j.id} video={j.video} />
        ))}
      </div>

      {/* LOOP remaining sections */}
      {sections.slice(1).map((group, index) => (
        <div key={index}>
          
          {/* FULL VIDEO */}
          <div className="h-screen w-full relative">
            <video
              src={group[0].video}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 " />
          </div>

          {/* NEXT LANES */}
          <div className="h-screen flex overflow-hidden">
            {group.map((j) => (
              <JourneyLane key={j.id} video={j.video} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
