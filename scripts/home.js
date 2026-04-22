export function initHome() {
  const map = document.querySelector(".area-img--map");
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (map) {
    if (reduced) {
      map.classList.add("is-inview");
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            map.classList.add("is-inview");
            observer.disconnect();
            break;
          }
        },
        { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.35 }
      );

      observer.observe(map);
    }
  }

  if (reduced) return;

  const root = document.documentElement;
  let raf = 0;

  const apply = () => {
    raf = 0;
    const y = window.scrollY || 0;
    root.style.setProperty("--forest-shift", `${Math.round(y * 0.12)}px`);
  };

  const onScroll = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(apply);
  };

  apply();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}
