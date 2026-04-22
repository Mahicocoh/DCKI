import { CATEGORY_LABEL, getListingFeatures, getListingPhotos, getListingFacts } from "./listings-data.js";
import { formatCHF, formatRooms, showToast } from "./ui.js";
import { loadListings } from "./listings-store.js";

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll("\n", " ");
}

function ensureModal() {
  let modal = document.querySelector("[data-modal]");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("data-modal", "1");
  modal.innerHTML = `
    <div class="backdrop" data-close></div>
    <div class="dialog" role="dialog" aria-modal="true" aria-label="Détail du bien">
      <div class="dialog-grid">
        <div class="media" data-gallery>
          <img data-modal-img alt="" />
          <button class="nav prev" type="button" aria-label="Photo précédente" data-photo-prev>‹</button>
          <button class="nav next" type="button" aria-label="Photo suivante" data-photo-next>›</button>
          <div class="count" data-photo-count></div>
        </div>
        <div class="content">
          <div class="titleRow">
            <div>
              <div class="pill" data-modal-pill></div>
              <h3 data-modal-title></h3>
              <div class="meta" data-modal-meta></div>
            </div>
            <button class="close" type="button" aria-label="Fermer" data-close>✕</button>
          </div>
          <p class="desc" data-modal-desc></p>
          <div class="facts" data-modal-facts></div>
          <div class="features" data-modal-features></div>
          <div class="cta">
            <a class="btn primary" href="./dossier.html" data-modal-cta-dossier>Demande de dossier</a>
            <a class="btn" href="./index.html#contact" data-modal-cta-visit>Demander une visite</a>
            <button class="btn" type="button" data-copy-ref>Copier la référence</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

const state = {
  listingId: null,
  photos: [],
  index: 0,
};

function setPhoto(modal, idx) {
  if (!state.photos.length) return;
  state.index = (idx + state.photos.length) % state.photos.length;
  const img = modal.querySelector("[data-modal-img]");
  const count = modal.querySelector("[data-photo-count]");
  const prev = modal.querySelector("[data-photo-prev]");
  const next = modal.querySelector("[data-photo-next]");
  const url = state.photos[state.index];
  img.src = url;
  if (count) count.textContent = `${state.index + 1} / ${state.photos.length}`;
  const showNav = state.photos.length > 1;
  if (prev) prev.style.display = showNav ? "" : "none";
  if (next) next.style.display = showNav ? "" : "none";
  if (count) count.style.display = showNav ? "" : "none";
}

function openModal(listing) {
  const modal = ensureModal();

  const img = modal.querySelector("[data-modal-img]");
  const pill = modal.querySelector("[data-modal-pill]");
  const title = modal.querySelector("[data-modal-title]");
  const meta = modal.querySelector("[data-modal-meta]");
  const desc = modal.querySelector("[data-modal-desc]");
  const facts = modal.querySelector("[data-modal-facts]");
  const features = modal.querySelector("[data-modal-features]");
  const copyBtn = modal.querySelector("[data-copy-ref]");
  const dossierBtn = modal.querySelector("[data-modal-cta-dossier]");
  const visitBtn = modal.querySelector("[data-modal-cta-visit]");

  img.alt = listing.title;
  state.listingId = listing.id;
  state.photos = getListingPhotos(listing, 10);
  setPhoto(modal, 0);

  const dotColor = listing.category === "sale" ? "rgba(200,161,74,.95)" : "rgba(64,140,255,.85)";
  const rawStatus = String(listing.status || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const isSold = rawStatus.includes("sold") || rawStatus.includes("vendu");
  const isRented = rawStatus.includes("rent") || rawStatus.includes("loue");
  const statusLabel = isSold ? "Vendu" : isRented ? "Loué" : "";
  pill.innerHTML = `
    <span style="width:10px;height:10px;border-radius:999px;background:${dotColor}"></span>
    <strong style="letter-spacing:.02em">${escapeHtml(CATEGORY_LABEL[listing.category] || "")}</strong>
    <span style="opacity:.65">•</span>
    <span style="opacity:.85">${escapeHtml(listing.propertyType)}</span>
    <span style="opacity:.65">•</span>
    <span style="opacity:.85">${escapeHtml(listing.id)}</span>
    ${statusLabel ? `<span style="opacity:.65">•</span><span style="opacity:.95">${escapeHtml(statusLabel)}</span>` : ""}
  `;

  title.textContent = listing.title;
  meta.textContent = `${listing.region} — ${listing.locality} • ${formatRooms(listing.rooms)} • ${listing.surface} m²`;
  desc.textContent = listing.description || "";

  const price = `${formatCHF(listing.price)}${listing.priceSuffix ? ` ${listing.priceSuffix}` : ""}`;
  const factsObj = getListingFacts(listing);
  facts.innerHTML = `
    <span class="tag">${escapeHtml(price)}</span>
    <span class="tag">${escapeHtml(listing.region)}</span>
    <span class="tag">${escapeHtml(listing.locality)}</span>
    <span class="tag">${escapeHtml(listing.propertyType)}</span>
    ${factsObj.availableFrom ? `<span class="tag">Disponible dès ${escapeHtml(factsObj.availableFrom)}</span>` : ""}
    ${factsObj.floor != null ? `<span class="tag">Étage ${escapeHtml(String(factsObj.floor))}</span>` : ""}
    ${factsObj.bathrooms != null ? `<span class="tag">${escapeHtml(String(factsObj.bathrooms))} sdb</span>` : ""}
    ${factsObj.newBuild ? `<span class="tag">Nouvelle construction</span>` : ""}
    ${factsObj.parking ? `<span class="tag">Parking</span>` : ""}
    ${factsObj.quietArea ? `<span class="tag">Quartier calme</span>` : ""}
    ${factsObj.childrenFriendly ? `<span class="tag">Adapté aux enfants</span>` : ""}
  `;

  const list = getListingFeatures(listing, 36);
  features.innerHTML = list.map((f) => `<span class="tag">${escapeHtml(f)}</span>`).join("");

  if (statusLabel) {
    if (dossierBtn instanceof HTMLAnchorElement) {
      dossierBtn.removeAttribute("href");
      dossierBtn.setAttribute("aria-disabled", "true");
      dossierBtn.tabIndex = -1;
      dossierBtn.classList.add("is-disabled");
    }
    if (visitBtn instanceof HTMLAnchorElement) {
      visitBtn.removeAttribute("href");
      visitBtn.setAttribute("aria-disabled", "true");
      visitBtn.tabIndex = -1;
      visitBtn.classList.add("is-disabled");
    }

    const cta = modal.querySelector(".cta");
    if (cta instanceof HTMLElement && !cta.querySelector(".unavailable-note")) {
      const note = document.createElement("div");
      note.className = "unavailable-note";
      note.style.marginTop = "12px";
      note.innerHTML = `
        <div class="badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="t">
          <div class="k">Indisponible</div>
          <div class="v">Ce bien est ${escapeHtml(statusLabel)}. Les demandes sont désactivées.</div>
        </div>
      `;
      cta.appendChild(note);
    }
  } else {
    if (dossierBtn instanceof HTMLAnchorElement) {
      const type = listing.category === "sale" ? "Achat" : "Location";
      dossierBtn.setAttribute("href", `./dossier.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(listing.id)}`);
      dossierBtn.removeAttribute("aria-disabled");
      dossierBtn.tabIndex = 0;
      dossierBtn.classList.remove("is-disabled");
    }
    if (visitBtn instanceof HTMLAnchorElement) {
      visitBtn.setAttribute("href", "./index.html#contact");
      visitBtn.removeAttribute("aria-disabled");
      visitBtn.tabIndex = 0;
      visitBtn.classList.remove("is-disabled");
    }

    const note = modal.querySelector(".cta .unavailable-note");
    note?.remove?.();
  }

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(listing.id);
      showToast(`Référence copiée : ${listing.id}`);
    } catch {
      showToast(`Référence : ${listing.id}`);
    }
  };

  modal.classList.add("show");
  document.body.style.overflow = "hidden";

  const focusTarget = modal.querySelector("[data-close]");
  focusTarget?.focus?.();
}

function closeModal() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;
  modal.classList.remove("show");
  document.body.style.overflow = "";
  state.listingId = null;
  state.photos = [];
  state.index = 0;
}

export function initListingDetails() {
  ensureModal();
  let listingsCache = null;
  const getListings = async () => {
    if (listingsCache) return listingsCache;
    listingsCache = await loadListings();
    return listingsCache;
  };

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    if (t.closest("[data-photo-prev]")) {
      const modal = document.querySelector("[data-modal]");
      if (!modal) return;
      setPhoto(modal, state.index - 1);
      return;
    }

    if (t.closest("[data-photo-next]")) {
      const modal = document.querySelector("[data-modal]");
      if (!modal) return;
      setPhoto(modal, state.index + 1);
      return;
    }

    if (t.closest("[data-close]")) {
      closeModal();
      return;
    }

    const card = t.closest(".card.listing");
    if (!card) return;

    const id = card.getAttribute("data-id") || "";
    if (!id) return;
    (async () => {
      const listings = await getListings();
      const listing = listings.find((l) => l.id === id);
      if (!listing) return;
      openModal(listing);
    })();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") {
      const modal = document.querySelector("[data-modal]");
      if (!modal || !modal.classList.contains("show")) return;
      setPhoto(modal, state.index - 1);
    }
    if (e.key === "ArrowRight") {
      const modal = document.querySelector("[data-modal]");
      if (!modal || !modal.classList.contains("show")) return;
      setPhoto(modal, state.index + 1);
    }
  });

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const card = t.closest?.(".card.listing");
    if (!card) return;
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();

    const id = card.getAttribute("data-id") || "";
    if (!id) return;
    (async () => {
      const listings = await getListings();
      const listing = listings.find((l) => l.id === id);
      if (!listing) return;
      openModal(listing);
    })();
  });
}
