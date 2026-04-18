import { mountLoader } from "./loader.js";
import { setActiveNav, wireForms, mountAdviceNav, mountAppointmentPlanner, mountBudgetCalculator, mountM2Calculator, mountRentMaxCalculator, mountRateCalculator, mountWhatsAppFab, mountToTopFab, mountCardGalleries, mountReveals, mountHeroTopbar, mountTopbarMenu, mountCountUps, mountTestimonials } from "./ui.js";
import { initRecherche } from "./recherche.js";
import { initBiens } from "./biens.js";
import { initHome } from "./home.js";
import { initVideoFallbacks } from "./video-fallback.js";
import { initListingPage } from "./listing-page.js";

mountLoader();

setActiveNav();
mountTopbarMenu();
mountAdviceNav();
mountBudgetCalculator();
mountM2Calculator();
mountRentMaxCalculator();
mountRateCalculator();
wireForms();
mountAppointmentPlanner();
initVideoFallbacks();
mountWhatsAppFab();
mountToTopFab();
mountCardGalleries();
mountReveals();
mountCountUps();
mountTestimonials();
mountHeroTopbar();

const page = document.body.getAttribute("data-page");
if (page === "home") initHome();
if (page === "recherche") initRecherche();
if (page === "biens") initBiens();
if (page === "listing") initListingPage();
