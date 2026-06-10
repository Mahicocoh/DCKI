import { t } from "./i18n.js?v=202606031430";

export function mountLoader() {
  const existing = document.querySelector(".loader[data-loader-root]");
  const el = existing instanceof HTMLDivElement ? existing : document.createElement("div");
  if (!(existing instanceof HTMLDivElement)) {
    el.className = "loader";
    el.setAttribute("data-loader-root", "1");
    el.innerHTML = `
      <div class="box">
        <div class="logo"><img src="./assets/1.jpg" alt="DCKImmo" /></div>
        <div class="bar" aria-label="${t("loader.barAria")}"><div></div></div>
        <p class="hint">${t("loader.hint")}</p>
      </div>
    `;
    document.body.appendChild(el);
  }

  const barWrap = el.querySelector(".bar");
  const hint = el.querySelector(".hint");
  if (barWrap instanceof HTMLDivElement) {
    barWrap.setAttribute("aria-label", t("loader.barAria"));
  }
  if (hint instanceof HTMLElement) {
    hint.textContent = t("loader.hint");
  }

  const bar = el.querySelector(".bar > div");
  if (!(bar instanceof HTMLDivElement)) return;
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const isMobile = window.matchMedia?.("(max-width: 820px)")?.matches;

  let pct = 0;
  const step = () => {
    pct = Math.min(92, pct + (prefersReduced ? 22 : isMobile ? 12 + Math.random() * 14 : 7 + Math.random() * 10));
    bar.style.width = `${pct}%`;
  };

  const timer = window.setInterval(step, prefersReduced ? 80 : isMobile ? 100 : 140);
  step();

  const page = document.body?.getAttribute("data-page") || "";
  const shouldWaitForHeroVideo = page === "home";
  let pageLoaded = shouldWaitForHeroVideo ? document.readyState !== "loading" : document.readyState === "complete";
  let heroReady = !shouldWaitForHeroVideo;

  if (shouldWaitForHeroVideo) {
    const hero = document.querySelector(".hero");
    const video = document.querySelector(".hero .hero-video");
    heroReady = Boolean(
      hero?.classList.contains("video-ready") ||
      hero?.classList.contains("video-failed") ||
      video?.getAttribute("data-show-controls") === "1"
    );
  }

  let doneOnce = false;
  const done = () => {
    if (!pageLoaded || !heroReady) return;
    if (doneOnce) return;
    doneOnce = true;
    window.clearInterval(timer);
    bar.style.width = "100%";
    window.setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity .22s ease";
      window.setTimeout(() => el.remove(), 260);
    }, prefersReduced ? 80 : 180);
  };

  const onPageLoaded = () => {
    pageLoaded = true;
    done();
  };

  const onHeroReady = () => {
    heroReady = true;
    done();
  };

  if (!pageLoaded) {
    const eventName = shouldWaitForHeroVideo ? "DOMContentLoaded" : "load";
    window.addEventListener(eventName, onPageLoaded, { once: true });
  }

  if (shouldWaitForHeroVideo) {
    window.addEventListener("dcki:hero-video-ready", onHeroReady, { once: true });
    window.addEventListener("dcki:hero-video-failed", onHeroReady, { once: true });
    window.setTimeout(onHeroReady, prefersReduced ? 900 : isMobile ? 1100 : 1600);
  } else {
    window.setTimeout(onHeroReady, prefersReduced ? 200 : 1200);
  }

  done();
}
