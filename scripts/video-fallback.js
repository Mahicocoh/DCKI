export function initVideoFallbacks() {
  const videos = document.querySelectorAll("video[data-video-fallback]");
  for (const video of videos) {
    const raw = video.getAttribute("data-video-fallback") || "";
    const sources = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!sources.length) continue;

    let idx = 0;
    const sourceEl = () => video.querySelector("source") || null;

    const setSrc = (src) => {
      let el = sourceEl();
      if (!el) {
        el = document.createElement("source");
        el.type = "video/mp4";
        video.appendChild(el);
      }
      el.src = src;
      video.load();
      video.play().catch(() => {});
    };

    setSrc(sources[idx]);

    video.addEventListener(
      "error",
      () => {
        if (idx >= sources.length - 1) return;
        idx += 1;
        setSrc(sources[idx]);
      },
      { passive: true }
    );
  }
}

