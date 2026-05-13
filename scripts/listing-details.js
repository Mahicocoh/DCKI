import { getListingFeatures, getListingPhotos, getListingFacts } from "./listings-data.js";
import { formatCHF, formatRooms, showToast } from "./ui.js?v=202606130002";
import { loadListings } from "./listings-store.js?v=202606120001";
import { pickListingText, t, translateListingFeature, translatePropertyType, translateRegionName } from "./i18n.js?v=202606120001";

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
    <div class="dialog" role="dialog" aria-modal="true" aria-label="${escapeAttr(t("listing.modalLabel"))}">
      <div class="dialog-grid">
        <div class="media" data-gallery>
          <img data-modal-img alt="" />
          <button class="nav prev" type="button" aria-label="${escapeAttr(t("aria.prevPhoto"))}" data-photo-prev>‹</button>
          <button class="nav next" type="button" aria-label="${escapeAttr(t("aria.nextPhoto"))}" data-photo-next>›</button>
          <div class="count" data-photo-count></div>
        </div>
        <div class="content">
          <div class="titleRow">
            <div>
              <div class="pill" data-modal-pill></div>
              <h3 data-modal-title></h3>
              <div class="meta" data-modal-meta></div>
            </div>
            <button class="close" type="button" aria-label="${escapeAttr(t("common.close"))}" data-close>✕</button>
          </div>
          <p class="desc" data-modal-desc></p>
          <div class="facts" data-modal-facts></div>
          <div class="features" data-modal-features></div>
          <div class="cta">
            <a class="btn primary" href="./dossier.html" data-modal-cta-dossier>${escapeHtml(t("listing.requestDossier"))}</a>
            <a class="btn" href="./index.html#contact" data-modal-cta-visit>${escapeHtml(t("listing.requestVisit"))}</a>
            <button class="btn" type="button" data-copy-ref>${escapeHtml(t("listing.copyRef"))}</button>
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

  const titleText = pickListingText(listing, "title");
  const descText = pickListingText(listing, "description");
  const regionText = translateRegionName(listing.region);
  const typeText = translatePropertyType(listing.propertyType);

  img.alt = titleText;
  state.listingId = listing.id;
  state.photos = getListingPhotos(listing, 10);
  setPhoto(modal, 0);

  const dotColor = listing.category === "sale" ? "rgba(200,161,74,.95)" : "rgba(64,140,255,.85)";
  const rawStatus = String(listing.status || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const isSold =
    rawStatus === "sold" ||
    rawStatus === "vendu" ||
    rawStatus === "vendue" ||
    rawStatus.includes("sold") ||
    rawStatus.includes("vendu");
  const isRented =
    rawStatus === "rented" ||
    rawStatus === "loue" ||
    rawStatus === "louee" ||
    rawStatus.includes("rented");
  const statusLabel = isSold ? t("status.sold") : isRented ? t("status.rented") : "";
  const isUnavailable = isSold || isRented;
  const categoryLabel = listing.category === "sale" ? t("biens.btn.sale") : listing.category === "rent" ? t("biens.btn.rent") : "";
  pill.innerHTML = `
    <span style="width:10px;height:10px;border-radius:999px;background:${dotColor}"></span>
    <strong style="letter-spacing:.02em">${escapeHtml(categoryLabel)}</strong>
    <span style="opacity:.65">•</span>
    <span style="opacity:.85">${escapeHtml(typeText)}</span>
    <span style="opacity:.65">•</span>
    <span style="opacity:.85">${escapeHtml(listing.id)}</span>
    ${statusLabel ? `<span style="opacity:.65">•</span><span style="opacity:.95">${escapeHtml(statusLabel)}</span>` : ""}
  `;

  title.textContent = titleText;
  meta.textContent = `${regionText} — ${listing.locality} • ${formatRooms(listing.rooms)} • ${listing.surface} m²`;
  desc.textContent = descText || "";

  const price = `${formatCHF(listing.price)}${listing.priceSuffix ? ` ${listing.priceSuffix}` : ""}`;
  const factsObj = getListingFacts(listing);
  facts.innerHTML = `
    <span class="tag">${escapeHtml(price)}</span>
    <span class="tag">${escapeHtml(regionText)}</span>
    <span class="tag">${escapeHtml(listing.locality)}</span>
    <span class="tag">${escapeHtml(typeText)}</span>
    ${factsObj.availableFrom ? `<span class="tag">${escapeHtml(t("listing.availableFrom", { date: factsObj.availableFrom }))}</span>` : ""}
    ${factsObj.floor != null ? `<span class="tag">${escapeHtml(t("listing.floor"))} ${escapeHtml(String(factsObj.floor))}</span>` : ""}
    ${factsObj.bathrooms != null ? `<span class="tag">${escapeHtml(String(factsObj.bathrooms))} ${escapeHtml(t("listing.bath"))}</span>` : ""}
    ${factsObj.newBuild ? `<span class="tag">${escapeHtml(t("listing.newBuild"))}</span>` : ""}
    ${factsObj.parking ? `<span class="tag">${escapeHtml(t("listing.parking"))}</span>` : ""}
    ${factsObj.quietArea ? `<span class="tag">${escapeHtml(t("listing.quietArea"))}</span>` : ""}
    ${factsObj.childrenFriendly ? `<span class="tag">${escapeHtml(t("listing.childrenFriendly"))}</span>` : ""}
  `;

  const list = getListingFeatures(listing, 36);
  features.innerHTML = list.map((f) => `<span class="tag">${escapeHtml(translateListingFeature(f))}</span>`).join("");

  if (isUnavailable) {
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
  } else {
    if (dossierBtn instanceof HTMLAnchorElement) {
      const type = listing.category === "sale" ? "sale" : listing.category === "rent" ? "rent" : "";
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
  }

  const cta = modal.querySelector(".cta");
  const existing = cta?.querySelector?.(".unavailable-note");
  if (existing) existing.remove?.();
  if (isUnavailable && cta instanceof HTMLElement) {
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
        <div class="k">${escapeHtml(t("listing.unavailableTitle"))}</div>
        <div class="v">${escapeHtml(t("listing.unavailableMsg", { status: statusLabel }))}</div>
      </div>
    `;
    cta.appendChild(note);
  }

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(listing.id);
      showToast(t("listing.refCopied", { id: listing.id }));
    } catch {
      showToast(t("listing.ref", { id: listing.id }));
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
