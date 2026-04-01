import { LOCALITIES, normalizeForSearch } from "./listings-data.js";

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
