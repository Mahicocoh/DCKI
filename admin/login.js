import { showToast } from "../scripts/ui.js";

const qs = new URLSearchParams(window.location.search);
const next = qs.get("next") || "/admin/index.html";

const form = document.querySelector("[data-admin-login]");
const hint = document.querySelector("[data-admin-login-hint]");

if (hint) {
  hint.textContent = "Astuce: les identifiants sont configurés côté serveur.";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const user = String(fd.get("user") || "");
  const password = String(fd.get("password") || "");

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      showToast(data.error || "Connexion impossible.");
      return;
    }
    window.location.replace(next);
  } catch {
    showToast("Connexion impossible.");
  }
});

