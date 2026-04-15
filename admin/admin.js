import { showToast } from "../scripts/ui.js";
import { getListingPhotos } from "../scripts/listings-data.js";

const listHost = document.querySelector("[data-admin-list]");
const countEl = document.querySelector("[data-admin-count]");
const qInput = document.querySelector("[data-admin-q]");
const form = document.querySelector("[data-admin-form]");
const btnNew = document.querySelector("[data-admin-new]");
const btnRefresh = document.querySelector("[data-admin-refresh]");
const btnSave = document.querySelector("[data-admin-save]");
const btnDelete = document.querySelector("[data-admin-delete]");
const btnLogout = document.querySelector("[data-admin-logout]");

const tagsHost = document.querySelector("[data-admin-tags]");
const tagsHidden = document.querySelector("[data-admin-tags-hidden]");
const tagInput = document.querySelector("[data-admin-tag-input]");
const tagAdd = document.querySelector("[data-admin-tag-add]");
const tagSuggest = document.querySelector("[data-admin-tag-suggest]");

const imageUrlInput = document.querySelector("[data-admin-image-url]");
const imageUploadInput = document.querySelector("[data-admin-image-upload]");
const imageUploadBtn = document.querySelector("[data-admin-image-upload-btn]");

const galleryHost = document.querySelector("[data-admin-gallery]");
const galleryUrlInput = document.querySelector("[data-admin-gallery-url]");
const galleryUrlAdd = document.querySelector("[data-admin-gallery-url-add]");
const galleryUploadInput = document.querySelector("[data-admin-gallery-upload]");
const galleryUploadBtn = document.querySelector("[data-admin-gallery-upload-btn]");
const dropzone = document.querySelector("[data-admin-dropzone]");

const previewImg = document.querySelector("[data-admin-preview-img]");
const previewTitle = document.querySelector("[data-admin-preview-title]");
const previewMeta = document.querySelector("[data-admin-preview-meta]");
const previewDesc = document.querySelector("[data-admin-preview-desc]");

let listings = [];
let selectedId = "";
let stateTags = [];
let stateGallery = [];
let dragIndex = null;

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toNumber(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const cleaned = s.replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

async function api(path, opts = {}) {
  const res = await fetch(path, { cache: "no-store", ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    const msg = data.error || `Erreur (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

async function uploadFiles(files) {
  const fd = new FormData();
  for (const f of files) fd.append("files", f, f.name);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || `Erreur (${res.status})`);
  const out = Array.isArray(data.files) ? data.files : [];
  return out.map((x) => x.url).filter(Boolean);
}

function uniq(arr) {
  const set = new Set();
  const out = [];
  for (const v of arr) {
    const s = String(v || "").trim();
    if (!s) continue;
    if (set.has(s.toLowerCase())) continue;
    set.add(s.toLowerCase());
    out.push(s);
  }
  return out;
}

function setTags(tags) {
  stateTags = uniq(tags);
  if (tagsHidden) tagsHidden.value = stateTags.join(", ");
  renderTags();
  updatePreview();
}

function renderTags() {
  if (!tagsHost) return;
  tagsHost.innerHTML = stateTags
    .map((t) => {
      return `<button class="tag" type="button" data-admin-tag="${escapeHtml(t)}" style="cursor:pointer"><span>${escapeHtml(t)}</span><span aria-hidden="true" style="opacity:.65;margin-left:6px">×</span></button>`;
    })
    .join("");
}

function setGallery(urls) {
  stateGallery = uniq(urls);
  renderGallery();
  updatePreview();
}

function renderGallery() {
  if (!galleryHost) return;
  const main = String(imageUrlInput?.value || "").trim();
  galleryHost.innerHTML = stateGallery
    .map((url, idx) => {
      const isMain = main && url === main;
      const k = isMain ? "Main" : `#${idx + 1}`;
      return `
        <div class="admin-thumb" draggable="true" data-admin-idx="${idx}">
          <img src="${escapeHtml(url)}" alt="" loading="lazy" />
          <div class="bar">
            <div class="k">${escapeHtml(k)}</div>
            <div class="btns">
              <button class="admin-mini-btn" type="button" data-admin-set-main="${idx}">Main</button>
              <button class="admin-mini-btn" type="button" data-admin-remove-photo="${idx}">Suppr</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function rebuildTagSuggest() {
  if (!tagSuggest) return;
  const all = [];
  for (const l of listings) {
    if (!Array.isArray(l.tags)) continue;
    all.push(...l.tags);
  }
  const unique = uniq(all).sort((a, b) => a.localeCompare(b, "fr"));
  tagSuggest.innerHTML = unique.map((t) => `<option value="${escapeHtml(t)}"></option>`).join("");
}

function normalizeDraftFromForm() {
  const fd = new FormData(form);

  return {
    id: String(fd.get("id") || "").trim(),
    category: String(fd.get("category") || "rent"),
    status: String(fd.get("status") || ""),
    propertyType: String(fd.get("propertyType") || "").trim(),
    title: String(fd.get("title") || "").trim(),
    description: String(fd.get("description") || "").trim(),
    region: String(fd.get("region") || "").trim(),
    locality: String(fd.get("locality") || "").trim(),
    rooms: toNumber(fd.get("rooms")),
    surface: toNumber(fd.get("surface")),
    price: toNumber(fd.get("price")),
    priceSuffix: String(fd.get("priceSuffix") || "").trim(),
    tags: stateTags.slice(),
    image: String(fd.get("image") || "").trim(),
    gallery: stateGallery.slice(),
  };
}

function setForm(draft) {
  form.id.value = draft?.id || "";
  form.category.value = draft?.category === "sale" ? "sale" : "rent";
  form.status.value = draft?.status || "";
  form.propertyType.value = draft?.propertyType || "";
  form.title.value = draft?.title || "";
  form.description.value = draft?.description || "";
  form.region.value = draft?.region || "";
  form.locality.value = draft?.locality || "";
  form.rooms.value = draft?.rooms ?? "";
  form.surface.value = draft?.surface ?? "";
  form.price.value = draft?.price ?? "";
  form.priceSuffix.value = draft?.priceSuffix || "";
  form.image.value = draft?.image || "";
  if (imageUrlInput) imageUrlInput.value = draft?.image || "";
  setTags(Array.isArray(draft?.tags) ? draft.tags : []);
  const baseGallery = Array.isArray(draft?.gallery) ? draft.gallery : [];
  if (baseGallery.length) {
    setGallery(baseGallery);
  } else if (draft?.id && draft?.image) {
    setGallery(getListingPhotos({ id: draft.id, image: draft.image, gallery: [] }, 12));
  } else if (draft?.image) {
    setGallery([draft.image]);
  } else {
    setGallery([]);
  }
  updatePreview();
}

function updatePreview() {
  const d = normalizeDraftFromForm();
  if (previewImg) {
    previewImg.src = d.image || "";
    previewImg.alt = d.title || "";
  }
  if (previewTitle) previewTitle.textContent = d.title || "—";
  if (previewMeta) {
    const left = [d.region, d.locality].filter(Boolean).join(" — ");
    const right = [d.propertyType, d.rooms != null ? `${String(d.rooms).replace(".", ",")} p.` : "", d.surface != null ? `${d.surface} m²` : ""]
      .filter(Boolean)
      .join(" • ");
    previewMeta.textContent = [left, right].filter(Boolean).join(" • ");
  }
  if (previewDesc) previewDesc.textContent = (d.description || "").slice(0, 180);
}

function renderList() {
  const q = String(qInput?.value || "").trim().toLowerCase();
  const filtered = !q
    ? listings
    : listings.filter((l) => {
        const hay = `${l.id} ${l.title} ${l.locality} ${l.region} ${l.propertyType}`.toLowerCase();
        return hay.includes(q);
      });

  if (countEl) countEl.textContent = `${filtered.length}`;
  if (!listHost) return;
  listHost.innerHTML = filtered
    .map((l) => {
      const active = l.id === selectedId ? " style=\"border-color: rgba(200,161,74,.7)\"" : "";
      const status = l.status === "sold" ? "Vendu" : l.status === "rented" ? "Loué" : "";
      return `
        <button class="btn" type="button" data-admin-pick="${escapeHtml(l.id)}"${active} style="justify-content:flex-start;width:100%">
          <span style="font-weight:900">${escapeHtml(l.id)}</span>
          <span style="opacity:.7">—</span>
          <span style="font-weight:800">${escapeHtml(l.title || "")}</span>
          ${status ? `<span class="tag" style="margin-left:auto">${escapeHtml(status)}</span>` : `<span style="margin-left:auto;opacity:.6">${escapeHtml(l.category === "sale" ? "Vente" : "Location")}</span>`}
        </button>
      `;
    })
    .join("");
}

async function load() {
  const data = await api("/api/admin/listings");
  listings = Array.isArray(data.listings) ? data.listings : [];
  if (!selectedId && listings.length) selectedId = listings[0].id;
  const selected = listings.find((l) => l.id === selectedId);
  if (selected) setForm(selected);
  rebuildTagSuggest();
  renderList();
}

function pick(id) {
  selectedId = id;
  const selected = listings.find((l) => l.id === selectedId);
  if (selected) setForm(selected);
  renderList();
}

btnNew?.addEventListener("click", () => {
  selectedId = "";
  setForm({
    id: "",
    category: "rent",
    status: "",
    propertyType: "",
    title: "",
    description: "",
    region: "",
    locality: "",
    rooms: 3.5,
    surface: 80,
    price: 0,
    priceSuffix: "/mois",
    tags: [],
    image: "",
    gallery: [],
  });
  renderList();
});

btnRefresh?.addEventListener("click", async () => {
  try {
    await load();
    showToast("Données rafraîchies.");
  } catch (e) {
    showToast(e.message || "Erreur.");
  }
});

btnSave?.addEventListener("click", async () => {
  try {
    const draft = normalizeDraftFromForm();
    if (!draft.id) {
      showToast("Référence requise.");
      return;
    }
    const exists = listings.some((l) => l.id === draft.id);
    if (!exists) {
      await api("/api/admin/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      selectedId = draft.id;
      await load();
      showToast("Bien créé.");
      return;
    }
    await api(`/api/admin/listing?id=${encodeURIComponent(draft.id)}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    selectedId = draft.id;
    await load();
    showToast("Bien enregistré.");
  } catch (e) {
    showToast(e.message || "Erreur.");
  }
});

btnDelete?.addEventListener("click", async () => {
  try {
    const draft = normalizeDraftFromForm();
    if (!draft.id) return;
    const ok = window.confirm(`Supprimer ${draft.id} ?`);
    if (!ok) return;
    await api(`/api/admin/listing?id=${encodeURIComponent(draft.id)}`, { method: "DELETE" });
    selectedId = "";
    await load();
    showToast("Bien supprimé.");
  } catch (e) {
    showToast(e.message || "Erreur.");
  }
});

btnLogout?.addEventListener("click", async () => {
  try {
    await api("/api/admin/logout", { method: "POST" });
  } catch {
  }
  window.location.replace("/admin/login.html");
});

qInput?.addEventListener("input", () => renderList());
form?.addEventListener("input", () => updatePreview());

tagAdd?.addEventListener("click", () => {
  const v = String(tagInput?.value || "").trim();
  if (!v) return;
  setTags([...stateTags, v]);
  if (tagInput) tagInput.value = "";
});
tagInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    tagAdd?.click();
  }
});

galleryUrlAdd?.addEventListener("click", () => {
  const v = String(galleryUrlInput?.value || "").trim();
  if (!v) return;
  setGallery([...stateGallery, v]);
  if (galleryUrlInput) galleryUrlInput.value = "";
});
galleryUrlInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    galleryUrlAdd?.click();
  }
});

async function handleUploadToGallery(files) {
  if (!files?.length) return;
  try {
    const urls = await uploadFiles(files);
    setGallery([...stateGallery, ...urls]);
    if (!String(imageUrlInput?.value || "").trim() && urls[0]) {
      if (imageUrlInput) imageUrlInput.value = urls[0];
      form.image.value = urls[0];
    }
    showToast("Photos ajoutées.");
  } catch (e) {
    showToast(e.message || "Upload impossible.");
  } finally {
    if (galleryUploadInput) galleryUploadInput.value = "";
  }
}

galleryUploadBtn?.addEventListener("click", () => {
  const files = galleryUploadInput?.files ? Array.from(galleryUploadInput.files) : [];
  handleUploadToGallery(files);
});

dropzone?.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone?.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone?.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
  handleUploadToGallery(files);
});

async function handleUploadMain() {
  const f = imageUploadInput?.files?.[0];
  if (!f) return;
  try {
    const urls = await uploadFiles([f]);
    const url = urls[0];
    if (!url) throw new Error("Upload impossible.");
    if (imageUrlInput) imageUrlInput.value = url;
    form.image.value = url;
    if (!stateGallery.includes(url)) setGallery([url, ...stateGallery]);
    showToast("Image principale mise à jour.");
  } catch (e) {
    showToast(e.message || "Upload impossible.");
  } finally {
    if (imageUploadInput) imageUploadInput.value = "";
  }
}

imageUploadBtn?.addEventListener("click", () => handleUploadMain());

imageUrlInput?.addEventListener("input", () => {
  form.image.value = String(imageUrlInput.value || "");
  updatePreview();
  renderGallery();
});

document.addEventListener("click", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;

  const tagBtn = t.closest("[data-admin-tag]");
  if (tagBtn) {
    const v = tagBtn.getAttribute("data-admin-tag") || "";
    setTags(stateTags.filter((x) => x.toLowerCase() !== v.toLowerCase()));
    return;
  }

  const rm = t.closest("[data-admin-remove-photo]");
  if (rm) {
    const idx = Number(rm.getAttribute("data-admin-remove-photo"));
    if (!Number.isFinite(idx)) return;
    const removed = stateGallery[idx];
    setGallery(stateGallery.filter((_, i) => i !== idx));
    if (removed && String(imageUrlInput?.value || "").trim() === removed) {
      const next = stateGallery.filter((_, i) => i !== idx)[0] || "";
      if (imageUrlInput) imageUrlInput.value = next;
      form.image.value = next;
      updatePreview();
    }
    return;
  }

  const setMain = t.closest("[data-admin-set-main]");
  if (setMain) {
    const idx = Number(setMain.getAttribute("data-admin-set-main"));
    if (!Number.isFinite(idx)) return;
    const url = stateGallery[idx] || "";
    if (!url) return;
    if (imageUrlInput) imageUrlInput.value = url;
    form.image.value = url;
    updatePreview();
    renderGallery();
    return;
  }

  const btn = t.closest("[data-admin-pick]");
  if (!btn) return;
  const id = btn.getAttribute("data-admin-pick") || "";
  if (!id) return;
  pick(id);
});

galleryHost?.addEventListener("dragstart", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  const el = t.closest("[data-admin-idx]");
  if (!el) return;
  dragIndex = Number(el.getAttribute("data-admin-idx"));
});
galleryHost?.addEventListener("dragover", (e) => e.preventDefault());
galleryHost?.addEventListener("drop", (e) => {
  e.preventDefault();
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  const el = t.closest("[data-admin-idx]");
  if (!el) return;
  const to = Number(el.getAttribute("data-admin-idx"));
  const from = dragIndex;
  dragIndex = null;
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === to) return;
  const next = stateGallery.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  setGallery(next);
});

load().catch(() => {
  window.location.replace("/admin/login.html");
});
