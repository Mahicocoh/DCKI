import { t } from "./i18n.js?v=202606102610";

export function mountLoader() {
  let isInternalNavigation = false;
  try {
    isInternalNavigation = window.sessionStorage?.getItem("dcki_internal_nav") === "1";
    window.sessionStorage?.removeItem("dcki_internal_nav");
  } catch {}

  if (isInternalNavigation) {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const startTs = Date.now();
    const minVisibleMs = prefersReduced ? 90 : 45;
    let pageLoaded = document.readyState !== "loading";
    let released = false;

    const finish = () => {
      document.body?.classList.remove("loader-active");
      document.body?.classList.remove("reload-masking");
      document.documentElement?.classList.remove("boot-loading");
      document.documentElement?.classList.remove("snapshot-blank");
      const loader = document.querySelector(".loader[data-loader-root]");
      if (loader instanceof HTMLElement) {
        loader.style.opacity = "0";
        loader.style.transition = "opacity .06s ease";
        window.setTimeout(() => loader.remove(), 75);
      }
    };

    const release = () => {
      if (released) return;
      if (!pageLoaded) return;
      const elapsed = Date.now() - startTs;
      const remaining = Math.max(0, minVisibleMs - elapsed);
      released = true;
      window.setTimeout(finish, remaining);
    };

    if (!pageLoaded) {
      window.addEventListener(
        "DOMContentLoaded",
        () => {
          pageLoaded = true;
          release();
        },
        { once: true }
      );
    }

    release();
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
            <svg class="status-spinner" viewBox="0 0 50 50" width="13" height="13" aria-hidden="true">
              <circle class="head" cx="25" cy="25" r="20" fill="none" stroke="#caa74f" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="18 100"></circle>
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
  const page = document.body?.getAttribute("data-page") || "";
  const shouldWaitForHeroVideo = page === "home";
  const minVisibleMs = prefersReduced ? 220 : isMobile ? 420 : 560;

  let pct = 0;
  const step = () => {
    pct = Math.min(92, pct + (prefersReduced ? 28 : isMobile ? 18 + Math.random() * 16 : 12 + Math.random() * 14));
    bar.style.width = `${pct}%`;
  };

  const timer = window.setInterval(step, prefersReduced ? 60 : isMobile ? 80 : 110);
  step();

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
    const elapsed = Date.now() - startTs;
    const remaining = Math.max(0, minVisibleMs - elapsed);
    window.setTimeout(() => {
      document.body?.classList.remove("loader-active");
      document.body?.classList.remove("reload-masking");
      document.documentElement?.classList.remove("boot-loading");
      document.documentElement?.classList.remove("snapshot-blank");
      el.style.opacity = "0";
      el.style.transition = "opacity .08s ease";
      window.setTimeout(() => el.remove(), 100);
    }, remaining + (prefersReduced ? 0 : 8));
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
  } else {
    window.setTimeout(onHeroReady, prefersReduced ? 200 : 1200);
  }

  done();
}
