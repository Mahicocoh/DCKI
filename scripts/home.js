function mountHomePhotoLightbox() {
  const targets = Array.from(
    document.querySelectorAll(
      "#bonnes-affaires .card.home-deal .media, #exemples-biens .card.listing .media"
    )
  );
  if (!targets.length) return;

  let lightbox = document.getElementById("home-photo-lightbox");
  if (!(lightbox instanceof HTMLElement)) {
    lightbox = document.createElement("div");
    lightbox.id = "home-photo-lightbox";
    lightbox.className = "lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <div class="inner">
        <img alt="" />
        <button class="close" type="button" aria-label="Fermer">x</button>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const img = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".close");
  if (!(img instanceof HTMLImageElement) || !(closeBtn instanceof HTMLButtonElement)) return;

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "";
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("show")) close();
  });

  for (const media of targets) {
    if (!(media instanceof HTMLElement) || media.dataset.lightboxBound === "1") continue;
    media.dataset.lightboxBound = "1";
    media.addEventListener("click", (e) => {
      const photo = media.querySelector("img");
      if (!(photo instanceof HTMLImageElement) || !photo.src) return;
      e.preventDefault();
      e.stopPropagation();
      open(photo.src, photo.alt);
    });
  }
}

export function initHome() {
  const map = document.querySelector(".area-img--map");
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const isMobile = window.matchMedia && window.matchMedia("(max-width: 720px)").matches;

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

  if (isMobile) mountHomePhotoLightbox();

  if (reduced || isMobile) {
    root.style.setProperty("--forest-shift", "0px");
    return;
  }

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
