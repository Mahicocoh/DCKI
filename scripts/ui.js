import { LOCALITIES, normalizeForSearch, LISTINGS, getListingPhotos } from "./listings-data.js";

export function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  for (const a of document.querySelectorAll("[data-nav] a")) {
    const href = a.getAttribute("href") || "";
    const cleanHref = href.split("?")[0].split("#")[0];
    const isActive = cleanHref.endsWith(path);
    a.classList.toggle("active", isActive);
  }
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
  const listing = LISTINGS.find((l) => l.id === id);
  if (!listing) return fallback;
  return getListingPhotos(listing, 10);
}

export function mountCardGalleries() {
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
}

export function mountReveals() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll("main > section:not(.hero)");
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

  for (const el of targets) {
    el.classList.add("reveal");
    io.observe(el);
  }
}
