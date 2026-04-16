import { LOCALITIES, normalizeForSearch, getListingPhotos } from "./listings-data.js";
import { loadListings } from "./listings-store.js";

export function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  for (const a of document.querySelectorAll("[data-nav] a")) {
    const href = a.getAttribute("href") || "";
    const cleanHref = href.split("?")[0].split("#")[0];
    const isActive = cleanHref.endsWith(path);
    a.classList.toggle("active", isActive);
  }
}

export function mountTopbarMenu() {
  const menus = Array.from(document.querySelectorAll("[data-topbar-menu]"));
  if (!menus.length) return;

  const getButton = (menu) => menu.querySelector("[data-topbar-menu-btn]");

  const close = (menu) => {
    menu.classList.remove("open");
    const btn = getButton(menu);
    if (btn) btn.setAttribute("aria-expanded", "false");
  };

  const closeAll = (except) => {
    for (const menu of menus) {
      if (except && menu === except) continue;
      close(menu);
    }
  };

  for (const menu of menus) {
    const btn = getButton(menu);
    if (!btn || btn.dataset.bound === "1") continue;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains("open");
      closeAll();
      if (!isOpen) {
        menu.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    for (const a of menu.querySelectorAll("[data-nav] a")) {
      a.addEventListener("click", () => close(menu));
    }
  }

  document.addEventListener("click", (e) => {
    for (const menu of menus) {
      if (menu.contains(e.target)) return;
    }
    closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

export function formatCHF(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(n);
}

export function formatRooms(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${n.toString().replace(".", ",")} p.`;
}

export function showToast(message) {
  const el = document.querySelector("[data-toast]");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 3200);
}

export function wireForms() {
  for (const form of document.querySelectorAll("form[data-demo-form]")) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const label = form.getAttribute("data-demo-form") || "Formulaire";
      showToast(`${label} envoyé.`);
      form.reset();
    });
  }
}

export function mountAppointmentPlanner() {
  const triggers = Array.from(document.querySelectorAll("[data-open-appointment]"));
  if (!triggers.length) return;

  const form = document.getElementById("contact-form");
  const planner = document.querySelector("[data-appointment-planner]");
  const dateInput = document.querySelector("[data-appointment-date]");
  const timeInput = document.querySelector("[data-appointment-time]");
  const messageInput = document.getElementById("contact-message");
  const requestType = document.getElementById("contact-request-type");

  if (!(form instanceof HTMLFormElement)) return;
  if (!(planner instanceof HTMLElement)) return;
  if (!(dateInput instanceof HTMLInputElement)) return;
  if (!(timeInput instanceof HTMLInputElement)) return;
  if (!(messageInput instanceof HTMLTextAreaElement)) return;

  let openedByUser = false;

  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  const formatDate = (raw) => {
    const [y, m, d] = raw.split("-").map(Number);
    if (!y || !m || !d) return "";
    const dd = String(d).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${dd}.${mm}`;
  };

  const clearAutoMessage = () => {
    const prev = messageInput.dataset.autoRdvMsg || "";
    if (!prev) return;
    const cleaned = messageInput.value
      .replace(prev, "")
      .replace(/\n{3,}/g, "\n\n")
      .trimEnd();
    messageInput.value = cleaned;
    delete messageInput.dataset.autoRdvMsg;
  };

  const isVisitRequest = () => {
    if (!(requestType instanceof HTMLSelectElement)) return true;
    return requestType.value === "Demande de visite";
  };

  const hidePlanner = () => {
    planner.hidden = true;
    planner.classList.remove("is-open");
    clearAutoMessage();
    dateInput.value = "";
    timeInput.value = "";
  };

  const applyAutoMessage = () => {
    clearAutoMessage();
    if (!openedByUser) return;
    if (!isVisitRequest()) return;
    if (!dateInput.value || !timeInput.value) return;

    const dateLabel = formatDate(dateInput.value);
    const msg = `Je suis disponible pour une visite le ${dateLabel} à ${timeInput.value}.`;
    const base = messageInput.value.trimEnd();
    messageInput.value = base ? `${base}\n\n${msg}` : msg;
    messageInput.dataset.autoRdvMsg = msg;
  };

  const openPlanner = () => {
    openedByUser = true;
    planner.hidden = false;
    planner.classList.add("is-open");
    if (requestType instanceof HTMLSelectElement) {
      requestType.value = "Demande de visite";
    }
    if (!dateInput.value) dateInput.value = dateInput.min || "";
    if (!timeInput.value) timeInput.value = "10:00";
    applyAutoMessage();
    window.setTimeout(() => dateInput.focus(), 120);
  };

  for (const trigger of triggers) {
    trigger.addEventListener("click", () => {
      openPlanner();
    });
  }

  dateInput.addEventListener("change", applyAutoMessage);
  timeInput.addEventListener("change", applyAutoMessage);

  if (requestType instanceof HTMLSelectElement) {
    requestType.addEventListener("change", () => {
      if (!openedByUser) return;
      if (!isVisitRequest()) hidePlanner();
      else applyAutoMessage();
    });
  }

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      openedByUser = false;
      hidePlanner();
    }, 0);
  });
}

export function getQueryParams() {
  const p = new URLSearchParams(window.location.search);
  const out = {};
  for (const [k, v] of p.entries()) out[k] = v;
  return out;
}

export function initAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  if (!input || !list) return;

  input.addEventListener("input", (e) => {
    const val = e.target.value;
    list.innerHTML = "";
    if (!val) {
      list.classList.remove("show");
      return;
    }

    const q = normalizeForSearch(val);
    const matches = LOCALITIES.filter(l => 
      normalizeForSearch(l.name).includes(q) || 
      normalizeForSearch(l.zip).includes(q) ||
      normalizeForSearch(l.region).includes(q)
    ).slice(0, 8); // max 8 results

    if (matches.length > 0) {
      matches.forEach(m => {
        const div = document.createElement("div");
        div.className = "autocomplete-item";
        div.innerHTML = `<strong>${m.name}</strong> <span class="region">${m.zip} - ${m.region}</span>`;
        div.addEventListener("click", () => {
          input.value = m.name;
          list.classList.remove("show");
          // Dispatch input event to trigger form updates if needed
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        list.appendChild(div);
      });
      list.classList.add("show");
    } else {
      list.classList.remove("show");
    }
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target !== input && e.target !== list) {
      list.classList.remove("show");
    }
  });
}

export function mountWhatsAppFab() {
  if (document.querySelector(".whatsapp-fab")) return;

  const telHref = document.querySelector("a[href^='tel:']")?.getAttribute("href") || "";
  const raw = (telHref.startsWith("tel:") ? telHref.slice(4) : telHref).trim();
  const fallback = "+41787338717";
  const phone = raw || fallback;
  const waPhone = phone.replace(/[^\d]/g, "");
  if (!waPhone) return;

  const a = document.createElement("a");
  a.className = "whatsapp-fab";
  a.href = `https://wa.me/${waPhone}`;
  a.target = "_blank";
  a.rel = "noreferrer";
  a.setAttribute("aria-label", "WhatsApp");
  a.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor"><path d="M19.11 17.23c-.23-.12-1.34-.66-1.55-.74-.21-.08-.37-.12-.53.12-.16.23-.61.74-.75.89-.14.16-.28.18-.51.06-.23-.12-.99-.36-1.89-1.14-.7-.62-1.17-1.39-1.31-1.62-.14-.23-.01-.35.11-.47.11-.11.23-.28.35-.42.12-.14.16-.23.23-.39.08-.16.04-.3-.02-.42-.06-.12-.53-1.28-.73-1.75-.19-.45-.38-.39-.53-.39h-.45c-.16 0-.42.06-.64.3-.21.23-.83.81-.83 1.98 0 1.16.85 2.29.97 2.45.12.16 1.67 2.55 4.04 3.58.56.24 1 .38 1.34.49.56.18 1.07.15 1.48.09.45-.07 1.34-.55 1.53-1.08.19-.53.19-.98.13-1.08-.06-.1-.21-.16-.44-.28z"/><path d="M16 3C8.83 3 3 8.58 3 15.45c0 2.41.73 4.76 2.1 6.78L4 29l7.02-1.82c1.88 1.01 4 1.55 5.98 1.55 7.17 0 13-5.58 13-12.45S23.17 3 16 3zm0 23.52c-1.86 0-3.63-.52-5.14-1.5l-.37-.24-4.17 1.08 1.12-4.03-.25-.39a10.6 10.6 0 0 1-1.75-5.99C5.44 9.83 10.23 5.6 16 5.6c5.77 0 10.56 4.23 10.56 9.85 0 5.62-4.79 10.07-10.56 10.07z"/></svg>';

  document.body.appendChild(a);
}

export function mountToTopFab() {
  if (document.querySelector(".to-top-fab")) return;

  const a = document.createElement("a");
  a.className = "to-top-fab";
  a.href = "#";
  a.setAttribute("aria-label", "Remonter en haut");
  a.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';

  const update = () => {
    const show = window.scrollY > 500;
    a.classList.toggle("show", show);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();

  a.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(a);
}

function getListingIdFromHref(href) {
  try {
    const u = new URL(href, window.location.href);
    const id = u.searchParams.get("id");
    return id ? String(id) : "";
  } catch {
    return "";
  }
}

function getCardListingId(card) {
  const fromData = card?.getAttribute("data-id") || "";
  if (fromData) return fromData;
  const href = card?.querySelector("a[href*='bien.html']")?.getAttribute("href") || "";
  return getListingIdFromHref(href);
}

function getCardPhotos(card) {
  const img = card.querySelector(".media img");
  const fallback = img?.getAttribute("src") ? [img.getAttribute("src")] : [];
  const id = getCardListingId(card);
  if (!id) return fallback;
  const listing = stateListings?.get(id);
  if (!listing) return fallback;
  return getListingPhotos(listing, 10);
}

let stateListings = null;

export function mountCardGalleries() {
  (async () => {
    if (!stateListings) {
      try {
        const listings = await loadListings();
        stateListings = new Map(listings.map((l) => [l.id, l]));
      } catch {
        stateListings = new Map();
      }
    }

    for (const card of document.querySelectorAll(".card.listing")) {
      const media = card.querySelector(".media");
      const img = media?.querySelector("img");
      if (!media || !img) continue;
      if (media.querySelector("[data-card-prev]")) continue;

      const photos = getCardPhotos(card);
      if (!photos || photos.length <= 1) continue;

      let idx = 0;
      const count = document.createElement("span");
      count.className = "card-gallery-count";
      count.setAttribute("data-card-count", "");

      const prev = document.createElement("span");
      prev.className = "card-gallery-nav prev";
      prev.setAttribute("role", "button");
      prev.setAttribute("tabindex", "0");
      prev.setAttribute("aria-label", "Photo précédente");
      prev.setAttribute("data-card-prev", "");
      prev.textContent = "‹";

      const next = document.createElement("span");
      next.className = "card-gallery-nav next";
      next.setAttribute("role", "button");
      next.setAttribute("tabindex", "0");
      next.setAttribute("aria-label", "Photo suivante");
      next.setAttribute("data-card-next", "");
      next.textContent = "›";

      const setIndex = (n) => {
        const len = photos.length;
        idx = ((n % len) + len) % len;
        img.src = photos[idx];
        count.textContent = `${idx + 1} / ${len}`;
      };

      const onPrev = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIndex(idx - 1);
      };
      const onNext = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIndex(idx + 1);
      };

      prev.addEventListener("click", onPrev);
      next.addEventListener("click", onNext);
      prev.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") onPrev(e);
      });
      next.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") onNext(e);
      });

      media.appendChild(prev);
      media.appendChild(next);
      media.appendChild(count);
      setIndex(0);
    }
  })();
}

export function mountReveals() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = [
    ...document.querySelectorAll("main > section:not(.hero)"),
    ...document.querySelectorAll("[data-reveal]"),
  ];
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  const unique = new Set(targets);
  for (const el of unique) {
    el.classList.add("reveal");
    io.observe(el);
  }
}

export function mountCountUps() {
  const els = [...document.querySelectorAll("[data-count-to]")];
  if (!els.length) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateRing = (valueEl) => {
    const ring = valueEl.parentElement?.querySelector?.(".kpi-ring");
    if (!ring) return;
    const fg = ring.querySelector(".kpi-fg");
    if (!(fg instanceof SVGCircleElement)) return;

    const raw = ring.getAttribute("data-kpi-progress");
    const progress = Math.max(0, Math.min(100, Number(raw ?? "100")));
    if (!Number.isFinite(progress)) return;

    const valueDuration = Number(valueEl.getAttribute("data-count-duration") || "1200");
    const ringDuration = Number(ring.getAttribute("data-kpi-duration") || String(valueDuration * 1.8));
    const duration = Number.isFinite(ringDuration) ? ringDuration : valueDuration;

    const len = fg.getTotalLength();
    fg.style.strokeDasharray = `${len}`;

    const to = len * (1 - progress / 100);
    if (reduced) {
      fg.style.strokeDashoffset = `${to}`;
      return;
    }

    const start = performance.now();
    const from = len;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * easeOutCubic(p);
      fg.style.strokeDashoffset = `${v}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const format = (n, decimals) => {
    const nf = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return nf.format(n);
  };

  const setText = (el, n) => {
    const to = Number(el.getAttribute("data-count-to") || "0");
    const decimals = Number(el.getAttribute("data-count-decimals") || (Number.isInteger(to) ? 0 : 1));
    const prefix = el.getAttribute("data-count-prefix") || "";
    const suffix = el.getAttribute("data-count-suffix") || "";
    const value = decimals === 0 ? Math.round(n) : Number(n.toFixed(decimals));
    el.textContent = `${prefix}${format(value, decimals)}${suffix}`;
  };

  for (const el of els) setText(el, 0);

  const animate = (el) => {
    const to = Number(el.getAttribute("data-count-to") || "0");
    const duration = Number(el.getAttribute("data-count-duration") || "1200");
    if (!Number.isFinite(to)) return;
    if (reduced) {
      setText(el, to);
      animateRing(el);
      return;
    }

    const start = performance.now();
    const from = 0;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * easeOutCubic(p);
      setText(el, v);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    animateRing(el);
  };

  const started = new WeakSet();

  if (!("IntersectionObserver" in window)) {
    for (const el of els) animate(el);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (started.has(e.target)) continue;
        started.add(e.target);
        animate(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.35 }
  );

  for (const el of els) io.observe(el);
}

export function mountTestimonials() {
  const roots = [...document.querySelectorAll("[data-testimonials]")];
  if (!roots.length) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  for (const root of roots) {
    if (root.dataset.bound === "1") continue;
    root.dataset.bound = "1";

    const track = root.querySelector("[data-testimonials-track]");
    const dotsWrap = root.querySelector("[data-testimonials-dots]");
    const prev = root.querySelector("[data-testimonials-prev]");
    const next = root.querySelector("[data-testimonials-next]");
    if (!track || !dotsWrap) continue;

    const slides = [...track.children].filter((n) => n.nodeType === 1);
    if (!slides.length) continue;

    let idx = 0;
    let timer = null;
    let paused = false;
    const AUTOPLAY_MS = 3800;

    const setIndex = (n) => {
      const len = slides.length;
      idx = ((n % len) + len) % len;
      track.style.transform = `translateX(${-idx * 100}%)`;
      for (let i = 0; i < dotsWrap.children.length; i += 1) {
        dotsWrap.children[i].classList.toggle("active", i === idx);
      }
    };

    dotsWrap.innerHTML = "";
    for (let i = 0; i < slides.length; i += 1) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "testimonials-dot";
      b.setAttribute("aria-label", `Aller à l’avis ${i + 1}`);
      b.addEventListener("click", () => {
        setIndex(i);
        restart();
      });
      dotsWrap.appendChild(b);
    }

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (reduced) return;
      if (timer || paused) return;
      timer = window.setInterval(() => setIndex(idx + 1), AUTOPLAY_MS);
    };

    const restart = () => {
      stop();
      start();
    };

    const pause = () => {
      paused = true;
      root.classList.add("is-paused");
      stop();
    };

    const resume = () => {
      paused = false;
      root.classList.remove("is-paused");
      start();
    };

    if (prev) {
      prev.addEventListener("click", () => {
        setIndex(idx - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", () => {
        setIndex(idx + 1);
        restart();
      });
    }

    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("pointerdown", pause);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);

    setIndex(0);
    start();
  }
}

export function mountHeroTopbar() {
  if (document.body.getAttribute("data-page") !== "home") return;
  const hero = document.querySelector(".hero");
  const title = document.querySelector("[data-topbar-title]");
  const cta = document.querySelector("[data-topbar-cta]");
  if (!hero || !title) return;

  const set = (past) => {
    document.body.classList.toggle("hero-past", past);
    if (cta) cta.classList.toggle("show", past);
  };

  if (!("IntersectionObserver" in window)) {
    const onScroll = () => set(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      set(!e.isIntersecting || e.intersectionRatio < 0.35);
    },
    { threshold: [0, 0.35, 0.7] }
  );
  io.observe(hero);
}
