export const VIDEO_PREVIEW_LIMIT_SECONDS = 3;

export function loopFirstSeconds(
  event,
  limitSeconds = VIDEO_PREVIEW_LIMIT_SECONDS,
  restartSeconds = 0
) {
  const video = event.currentTarget;
  const duration = Number.isFinite(video.duration) ? video.duration : limitSeconds;
  const limit = Math.min(limitSeconds, duration);
  const restartPoint = Math.max(0, Math.min(restartSeconds, limit));

  if (video.currentTime >= limit) {
    video.currentTime = restartPoint;

    if (!video.paused) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    }
  }
}
