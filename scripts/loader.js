import { t } from "./i18n.js?v=202606102610";

export function mountLoader() {
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
  const animateBarWidth = (bar, from, to, duration) => {
    if (!(bar instanceof HTMLDivElement)) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = duration <= 0 ? 1 : Math.min(1, (now - start) / duration);
      const value = from + (to - from) * easeOutCubic(progress);
      bar.style.width = `${value}%`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  let isInternalNavigation = false;
  try {
    isInternalNavigation = window.sessionStorage?.getItem("dcki_internal_nav") === "1";
    window.sessionStorage?.removeItem("dcki_internal_nav");
  } catch {}

  if (isInternalNavigation) {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const startTs = Date.now();
    const minVisibleMs = prefersReduced ? 150 : 260;
    let pageLoaded = document.readyState === "complete";
    let released = false;

    const finish = () => {
      document.body?.classList.remove("loader-active");
      document.body?.classList.remove("reload-masking");
      document.documentElement?.classList.remove("boot-loading");
      document.documentElement?.classList.remove("snapshot-blank");
      const loader = document.querySelector(".loader[data-loader-root]");
      if (loader instanceof HTMLElement) {
        loader.style.opacity = "0";
        loader.style.transition = "opacity .12s ease";
        window.setTimeout(() => loader.remove(), 130);
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
        "load",
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
  const minVisibleMs = prefersReduced ? 1800 : 3000;
  const progressRampMs = prefersReduced ? 1500 : 2550;
  const maxAutoReleaseMs = prefersReduced ? 2200 : 3200;

  let pct = 0;
  const step = () => {
    const elapsed = Date.now() - startTs;
    const baseTarget = 10 + 76 * Math.min(1, elapsed / progressRampMs);
    const target = Math.min(86, baseTarget);
    if (target <= pct + 0.4) return;
    const from = pct;
    pct = target;
    animateBarWidth(bar, from, target, prefersReduced ? 140 : isMobile ? 190 : 220);
  };

  const timer = window.setInterval(step, prefersReduced ? 70 : 90);
  step();

  const allowHeroVisibleRelease = shouldWaitForHeroVideo;
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
  let maxWaitTimer = 0;
  const done = () => {
    if (!pageLoaded || !heroReady) return;
    if (doneOnce) return;
    doneOnce = true;
    window.clearInterval(timer);
    if (maxWaitTimer) window.clearTimeout(maxWaitTimer);
    const finalBarMs = prefersReduced ? 180 : isMobile ? 300 : 340;
    const finalHoldMs = prefersReduced ? 70 : isMobile ? 150 : 170;
    const finalFrom = Math.min(92, Math.max(pct, 84));
    pct = 100;
    animateBarWidth(bar, finalFrom, 100, finalBarMs);
    const elapsed = Date.now() - startTs;
    const remaining = Math.max(0, minVisibleMs - elapsed);
    window.setTimeout(() => {
      bar.style.width = "100%";
      document.body?.classList.remove("loader-active");
      document.body?.classList.remove("reload-masking");
      document.documentElement?.classList.remove("boot-loading");
      document.documentElement?.classList.remove("snapshot-blank");
      el.style.opacity = "0";
      el.style.transition = "opacity .1s ease";
      window.setTimeout(() => el.remove(), 110);
    }, Math.max(remaining, finalBarMs + finalHoldMs) + (prefersReduced ? 12 : 22));
  };

  const onPageLoaded = () => {
    pageLoaded = true;
    done();
  };

  const onHeroReady = () => {
    heroReady = true;
    done();
  };

  const forceAutoRelease = () => {
    pageLoaded = true;
    heroReady = true;
    done();
  };

  const onHeroVisible = () => {
    if (!allowHeroVisibleRelease || heroReady) return;
    window.setTimeout(() => {
      if (heroReady) return;
      heroReady = true;
      done();
    }, prefersReduced ? 40 : 120);
  };

  if (!pageLoaded) {
    const eventName = shouldWaitForHeroVideo ? "DOMContentLoaded" : "load";
    window.addEventListener(eventName, onPageLoaded, { once: true });
  }

  if (shouldWaitForHeroVideo) {
    window.addEventListener("dcki:hero-video-ready", onHeroReady, { once: true });
    window.addEventListener("dcki:hero-video-failed", onHeroReady, { once: true });
    if (allowHeroVisibleRelease) {
      window.addEventListener("dcki:hero-video-visible", onHeroVisible, { once: true });
    }
  } else {
    window.setTimeout(onHeroReady, prefersReduced ? 200 : 1200);
  }

  if (!shouldWaitForHeroVideo) {
    maxWaitTimer = window.setTimeout(forceAutoRelease, maxAutoReleaseMs);
  }

  done();
}
