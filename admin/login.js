import { showToast } from "../scripts/ui.js";
import { initI18n, t } from "../scripts/i18n.js?v=202606110006";

const qs = new URLSearchParams(window.location.search);
const next = qs.get("next") || "/admin/index.html";

const form = document.querySelector("[data-admin-login]");
const hint = document.querySelector("[data-admin-login-hint]");

initI18n();

if (hint) {
  hint.textContent = t("admin.login.tip");
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
      showToast(data.error || t("admin.login.failed"));
      return;
    }
    window.location.replace(next);
  } catch {
    showToast(t("admin.login.failed"));
  }
});

