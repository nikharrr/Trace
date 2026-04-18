export default function IntroVideo({ onEnded }) {
  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute inset-x-0 top-8 z-20 flex justify-center">
        <h1 className="text-3xl font-semibold tracking-[0.25em] text-white md:text-5xl">
          TRACE
        </h1>
      </div>

      {/* VIDEO */}
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* TEXT OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <h1 className="
          intro-fade-text
          text-[40px] md:text-[90px]
          leading-[1.04]
          tracking-[-0.02em]
          text-white/100
          mix-blend-overlay
        ">
            <p>
                Turn your life into a beautiful
            </p>
            <p> timeline.</p>
           
        </h1>
      </div>

    </div>
  );
}
