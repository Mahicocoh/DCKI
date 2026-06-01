const pickService = () => {
  const params = new URLSearchParams(window.location.search || "");
  const raw = (params.get("service") || "").trim().toLowerCase();
  if (!raw) return "generic";
  return raw;
};

const getLang = () => {
  const stored = (window.localStorage.getItem("dcki_lang") || "").trim().toLowerCase();
  if (stored === "en") return "en";
  return "fr";
};

const copy = (lang) => {
  if (lang === "en") {
    return {
      title: "Under construction",
      leadGeneric: "This page will be available soon.",
      leadClean: "Service in progress. Coming soon.",
      back: "Back to website",
      contact: "Contact me",
      svcGeneric: "DCKImmo",
      svcClean: "DCKI Clean Service",
    };
  }
  return {
    title: "Site en construction",
    leadGeneric: "Cette page sera disponible prochainement.",
    leadClean: "Service en préparation. Bientôt disponible.",
    back: "Retour au site",
    contact: "Me contacter",
    svcGeneric: "DCKImmo",
    svcClean: "DCKI Clean Service",
  };
};

const getConfig = (service) => {
  if (service === "clean" || service === "clean-service" || service === "dcki-clean") {
    return {
      kind: "clean",
    };
  }

  return {
    kind: "generic",
  };
};

const cleanIcon = () => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9.2 3.5 11 5.3 9.2 7.1 7.4 5.3 9.2 3.5Z"></path>
    <path d="M16.6 4.8 18 6.2 16.6 7.6 15.2 6.2 16.6 4.8Z"></path>
    <path d="M18.5 9.2 20.2 10.9 18.5 12.6 16.8 10.9 18.5 9.2Z"></path>
    <path d="M6.3 10.6 12.8 4.1"></path>
    <path d="M5.2 12.5 4 13.7l6.6 6.6 1.2-1.2"></path>
    <path d="M8.7 16 16.2 8.5"></path>
    <path d="M3.7 14.1 2.6 15.2"></path>
    <path d="M8.8 21.2 9.9 20.1"></path>
  </svg>
`.trim();

const apply = () => {
  const page = document.body.getAttribute("data-page");
  if (page !== "coming-soon") return;

  const service = pickService();
  const cfg = getConfig(service);
  const lang = getLang();
  const c = copy(lang);

  const title = document.querySelector("[data-coming-title]");
  if (title instanceof HTMLElement) title.textContent = c.title;

  const sub = document.querySelector("[data-coming-sub]");
  if (sub instanceof HTMLElement) sub.textContent = cfg.kind === "clean" ? c.svcClean : c.svcGeneric;

  const lead = document.querySelector("[data-coming-lead]");
  if (lead instanceof HTMLElement) lead.textContent = cfg.kind === "clean" ? c.leadClean : c.leadGeneric;

  const logo = document.querySelector("[data-coming-logo]");
  if (logo instanceof HTMLElement) {
    if (cfg.kind === "clean") {
      logo.innerHTML = cleanIcon();
    } else {
      logo.innerHTML = `<img src="./assets/1.jpg" alt="${c.svcGeneric}" />`;
    }
  }

  const back = document.querySelector("[data-coming-back]");
  if (back instanceof HTMLElement) back.textContent = c.back;

  const contact = document.querySelector("[data-coming-contact]");
  if (contact instanceof HTMLElement) contact.textContent = c.contact;

  document.title = `${c.title} — ${cfg.kind === "clean" ? c.svcClean : c.svcGeneric}`;
};

export function initComingSoon() {
  apply();
  window.addEventListener("dcki:lang", apply);
}
