import { t } from "./i18n.js?v=202606102540";

export function mountLoader() {
  let isInternalNavigation = false;
  try {
    isInternalNavigation = window.sessionStorage?.getItem("dcki_internal_nav") === "1";
    window.sessionStorage?.removeItem("dcki_internal_nav");
  } catch {}

  if (isInternalNavigation) {
    document.body?.classList.remove("loader-active");
    document.body?.classList.remove("reload-masking");
    document.documentElement?.classList.remove("boot-loading");
    document.documentElement?.classList.remove("snapshot-blank");
    document.querySelector(".loader[data-loader-root]")?.remove();
    return;
  }

  const existing = document.querySelector(".loader[data-loader-root]");
  const el = existing instanceof HTMLDivElement ? existing : document.createElement("div");
  if (!(existing instanceof HTMLDivElement)) {
    el.className = "loader";
    el.setAttribute("data-loader-root", "1");
    el.innerHTML = `
      <div class="box">
        <div class="logo"><img src="./assets/1.jpg" alt="DCKImmo" /></div>
        <div class="bar" aria-label="${t("loader.barAria")}"><div></div></div>
        <div class="status">
          <div class="status-line">
            <svg class="status-spinner" viewBox="0 0 50 50" aria-hidden="true">
              <circle class="head" cx="25" cy="25" r="20"></circle>
            </svg>
            <p class="hint">${t("loader.hint")}</p>
          </div>
          <p class="subhint">${t("loader.subhint")}</p>
        </div>
      </div>
    `;
    document.body.appendChild(el);
  }

  const barWrap = el.querySelector(".bar");
  const hint = el.querySelector(".hint");
  const subhint = el.querySelector(".subhint");
  if (barWrap instanceof HTMLDivElement) {
    barWrap.setAttribute("aria-label", t("loader.barAria"));
  }
  if (hint instanceof HTMLElement) {
    hint.textContent = t("loader.hint");
  }
  if (subhint instanceof HTMLElement) {
    subhint.textContent = t("loader.subhint");
  }

  const bar = el.querySelector(".bar > div");
  if (!(bar instanceof HTMLDivElement)) return;
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const isMobile = window.matchMedia?.("(max-width: 820px)")?.matches;
  const startTs = Date.now();
  const minVisibleMs = prefersReduced ? 1000 : isMobile ? 2150 : 2200;

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
      hero?.classList.contains("video-visible") ||
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
    const elapsed = Date.now() - startTs;
    const remaining = Math.max(0, minVisibleMs - elapsed);
    window.setTimeout(() => {
      document.body?.classList.remove("loader-active");
      document.body?.classList.remove("reload-masking");
      document.documentElement?.classList.remove("boot-loading");
      document.documentElement?.classList.remove("snapshot-blank");
      el.style.opacity = "0";
      el.style.transition = "opacity .22s ease";
      window.setTimeout(() => el.remove(), 260);
    }, remaining + (prefersReduced ? 80 : 180));
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
    window.addEventListener("dcki:hero-video-visible", onHeroReady, { once: true });
    window.addEventListener("dcki:hero-video-ready", onHeroReady, { once: true });
    window.addEventListener("dcki:hero-video-failed", onHeroReady, { once: true });
    window.setTimeout(onHeroReady, prefersReduced ? 700 : isMobile ? 1600 : 2400);
  } else {
    window.setTimeout(onHeroReady, prefersReduced ? 200 : 1200);
  }

  done();
}
