export function mountLoader() {
  const el = document.createElement("div");
  el.className = "loader";
  el.innerHTML = `
    <div class="box">
      <div class="logo"><img src="./assets/1.jpg" alt="DCKImmo" /></div>
      <div class="bar" aria-label="Chargement"><div></div></div>
      <p class="hint">Chargement de DCKImmo…</p>
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

  const t = window.setInterval(step, prefersReduced ? 90 : 140);
  step();

  let doneOnce = false;
  const done = () => {
    if (doneOnce) return;
    doneOnce = true;
    window.clearInterval(t);
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
