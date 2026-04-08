import { mountLoader } from "./loader.js";
import { setActiveNav, wireForms, mountWhatsAppFab, mountToTopFab, mountCardGalleries, mountReveals } from "./ui.js";
import { initRecherche } from "./recherche.js";
import { initBiens } from "./biens.js";
import { initHome } from "./home.js";
import { initVideoFallbacks } from "./video-fallback.js";
import { initListingPage } from "./listing-page.js";

mountLoader();

window.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  wireForms();
  initVideoFallbacks();
  mountWhatsAppFab();
  mountToTopFab();
  mountCardGalleries();
  mountReveals();

  const page = document.body.getAttribute("data-page");
  if (page === "home") initHome();
  if (page === "recherche") initRecherche();
  if (page === "biens") initBiens();
  if (page === "listing") initListingPage();
});
