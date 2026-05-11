import { t } from "./i18n.js?v=202606110006";

export function mountLoader() {
  const el = document.createElement("div");
  el.className = "loader";
  el.innerHTML = `
    <div class="box">
      <div class="logo"><img src="./assets/1.jpg" alt="DCKImmo" /></div>
      <div class="bar" aria-label="${t("loader.barAria")}"><div></div></div>
      <p class="hint">${t("loader.hint")}</p>
    </div>
  `;

  const bar = el.querySelector(".bar > div");
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  document.body.appendChild(el);

  let pct = 0;
  const step = () => {
    pct = Math.min(92, pct + (prefersReduced ? 20 : 7 + Math.random() * 10));
    bar.style.width = `${pct}%`;
  };

  const timer = window.setInterval(step, prefersReduced ? 90 : 140);
  step();

  let doneOnce = false;
  const done = () => {
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

  window.addEventListener("load", done, { once: true });
  window.setTimeout(done, prefersReduced ? 200 : 1200);
}
