export function initHome() {
  const map = document.querySelector(".area-img--map");
  if (!map) return;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    map.classList.add("is-inview");
    return;
  }

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
