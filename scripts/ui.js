import { LOCALITIES, normalizeForSearch, getListingPhotos } from "./listings-data.js";
import { loadListings } from "./listings-store.js?v=202606110009";
import { getLang, t } from "./i18n.js?v=202606110006";

export function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  for (const a of document.querySelectorAll("[data-nav] a")) {
    const href = a.getAttribute("href") || "";
    const cleanHref = href.split("?")[0].split("#")[0];
    const isActive = cleanHref.endsWith(path);
    a.classList.toggle("active", isActive);
  }
}

export function mountTopbarMenu() {
  const menus = Array.from(document.querySelectorAll("[data-topbar-menu]"));
  if (!menus.length) return;

  const getButton = (menu) => menu.querySelector("[data-topbar-menu-btn]");
  const getOverlay = (menu) => menu.querySelector("[data-topbar-menu-overlay]");
  const getPanel = (menu) => menu.querySelector(".topbar-menu-panel");

  const syncBodyLock = () => {
    const anyOpen = menus.some((m) => m.classList.contains("open"));
    document.body.classList.toggle("menu-open", anyOpen);
  };

  const close = (menu) => {
    menu.classList.remove("open");
    const btn = getButton(menu);
    if (btn) btn.setAttribute("aria-expanded", "false");
    syncBodyLock();
  };

  const closeAll = (except) => {
    for (const menu of menus) {
      if (except && menu === except) continue;
      close(menu);
    }
    syncBodyLock();
  };

  for (const menu of menus) {
    const btn = getButton(menu);
    if (!btn || btn.dataset.bound === "1") continue;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = menu.classList.contains("open");
      closeAll();
      if (!isOpen) {
        menu.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        syncBodyLock();
      }
    });

    for (const a of menu.querySelectorAll("[data-nav] a")) {
      a.addEventListener("click", () => close(menu));
    }

    const overlay = getOverlay(menu);
    if (overlay instanceof HTMLElement) {
      overlay.addEventListener("click", () => close(menu));
    }

    const panel = getPanel(menu);
    if (panel instanceof HTMLElement && panel.dataset.swipeBound !== "1") {
      panel.dataset.swipeBound = "1";
      let startX = 0;
      let startY = 0;
      let dxEnd = 0;

      panel.addEventListener(
        "touchstart",
        (e) => {
          const t = e.touches && e.touches[0];
          if (!t) return;
          startX = t.clientX;
          startY = t.clientY;
          dxEnd = 0;
        },
        { passive: true }
      );

      panel.addEventListener(
        "touchmove",
        (e) => {
          const t = e.touches && e.touches[0];
          if (!t) return;
          const dx = t.clientX - startX;
          const dy = t.clientY - startY;
          if (Math.abs(dy) > 18) return;
          dxEnd = dx;
        },
        { passive: true }
      );

      panel.addEventListener(
        "touchend",
        () => {
          if (dxEnd > 80) close(menu);
        },
        { passive: true }
      );
    }
  }

  document.addEventListener("click", (e) => {
    for (const menu of menus) {
      if (menu.contains(e.target)) return;
    }
    closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

export function mountAdviceNav() {
  const nav = document.querySelector(".advice-nav-inner");
  if (!(nav instanceof HTMLElement)) return;

  const chips = Array.from(nav.querySelectorAll("a.advice-chip[href^=\"#\"]"));
  if (!chips.length) return;

  const topbar = document.querySelector(".topbar");
  const getOffset = () => {
    if (topbar instanceof HTMLElement) {
      return Math.ceil(topbar.getBoundingClientRect().height + 14);
    }
    return 110;
  };

  const getTargets = () => {
    const items = [];
    for (const chip of chips) {
      const hash = chip.getAttribute("href") || "";
      const id = hash.startsWith("#") ? hash.slice(1) : "";
      if (!id) continue;
      const el = document.getElementById(id);
      if (!el) continue;
      items.push({ id, el, chip });
    }
    return items;
  };

  const setActive = (id) => {
    for (const chip of chips) {
      const hash = chip.getAttribute("href") || "";
      const chipId = hash.startsWith("#") ? hash.slice(1) : "";
      chip.classList.toggle("is-active", chipId === id);
    }
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = getOffset();
    const top = window.scrollY + el.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    setActive(id);
  };

  for (const chip of chips) {
    const hash = chip.getAttribute("href") || "";
    const id = hash.startsWith("#") ? hash.slice(1) : "";
    if (!id) continue;
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToId(id);
    });
  }

  let ticking = false;
  const updateActiveOnScroll = () => {
    ticking = false;
    const targets = getTargets();
    if (!targets.length) return;
    const offset = getOffset();
    const pos = window.scrollY + offset + 1;
    let current = targets[0];
    for (const t of targets) {
      const tTop = window.scrollY + t.el.getBoundingClientRect().top;
      if (tTop <= pos) current = t;
    }
    setActive(current.id);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateActiveOnScroll);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateActiveOnScroll();
}

export function mountBudgetCalculator() {
  const steps = Array.from(document.querySelectorAll("[data-budget-calc]"));
  if (!steps.length) return;

  if (!window.__dckiAdviceCalcDelegated) {
    window.__dckiAdviceCalcDelegated = true;
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      const budgetBtn = t.closest("[data-budget-calc-toggle]");
      if (budgetBtn) {
        const step = budgetBtn.closest(".advice-step");
        const panel = step?.querySelector?.("[data-budget-calc]");
        if (panel instanceof HTMLElement) {
          panel.hidden = !panel.hidden;
          if (!panel.hidden) {
            const display = panel.querySelector("[data-inline-calc-display]");
            if (display instanceof HTMLInputElement && typeof display.focus === "function") {
              window.setTimeout(() => display.focus(), 0);
            }
          }
        }
      }

      const mortBtn = t.closest("[data-mortgage-calc-toggle]");
      if (mortBtn) {
        const step = mortBtn.closest(".advice-step");
        const panel = step?.querySelector?.("[data-mortgage-calc]");
        if (panel instanceof HTMLElement) {
          panel.hidden = !panel.hidden;
          if (!panel.hidden) {
            const amount = panel.querySelector("[data-mortgage-amount]");
            if (amount instanceof HTMLInputElement && typeof amount.focus === "function") {
              window.setTimeout(() => amount.focus(), 80);
            }
          }
        }
      }

      const m2Btn = t.closest("[data-m2-calc-toggle]");
      if (m2Btn) {
        const step = m2Btn.closest(".advice-step");
        const panel = step?.querySelector?.("[data-m2-calc]");
        if (panel instanceof HTMLElement) {
          panel.hidden = !panel.hidden;
          if (!panel.hidden) {
            const price = panel.querySelector("[data-m2-price]");
            if (price instanceof HTMLInputElement && typeof price.focus === "function") {
              window.setTimeout(() => price.focus(), 80);
            }
          }
        }
      }

      const rentBtn = t.closest("[data-rent-calc-toggle]");
      if (rentBtn) {
        const step = rentBtn.closest(".advice-step");
        const panel = step?.querySelector?.("[data-rent-calc]");
        if (panel instanceof HTMLElement) {
          panel.hidden = !panel.hidden;
          if (!panel.hidden) {
            const inc = panel.querySelector("[data-rent-income]");
            if (inc instanceof HTMLInputElement && typeof inc.focus === "function") {
              window.setTimeout(() => inc.focus(), 80);
            }
          }
        }
      }
    });
  }

  for (const panel of steps) {
    if (!(panel instanceof HTMLElement)) continue;
    const step = panel.closest(".advice-step");
    if (!(step instanceof HTMLElement)) continue;

    const display = panel.querySelector("[data-inline-calc-display]");
    const keys = Array.from(panel.querySelectorAll("[data-inline-calc-key]"));
    if (!(display instanceof HTMLInputElement)) continue;
    if (!keys.length) continue;

    let entry = "0";
    let left = null;
    let op = null;
    let justEvaluated = false;

    const opLabel = (o) => {
      if (o === "-") return "−";
      return o;
    };

    const render = () => {
      if (op && left !== null) {
        const base = `${left} ${opLabel(op)}`;
        display.value = entry === "" ? base : `${base} ${entry}`;
        return;
      }
      display.value = entry === "" ? "0" : entry;
    };

    const asNumber = (v) => {
      const n = Number(String(v).replace(",", "."));
      return Number.isFinite(n) ? n : NaN;
    };

    const addDigit = (d) => {
      if (justEvaluated) {
        left = null;
        op = null;
        justEvaluated = false;
        entry = "";
      }
      if (entry === "") entry = "0";
      if (d === ".") {
        if (entry.includes(".")) return;
        entry = `${entry}.`;
        render();
        return;
      }
      if (d === "00") {
        if (entry === "0") return;
        entry = `${entry}00`;
        render();
        return;
      }
      if (entry === "0") entry = d;
      else entry = `${entry}${d}`;
      render();
    };

    const compute = (a, b, o) => {
      if (o === "+") return a + b;
      if (o === "-" || o === "−") return a - b;
      if (o === "×") return a * b;
      if (o === "÷") return b === 0 ? NaN : a / b;
      return b;
    };

    const applyOp = (nextOp) => {
      if (justEvaluated) justEvaluated = false;
      const num = entry === "" ? NaN : asNumber(entry);
      if (entry !== "" && !Number.isFinite(num)) return;

      if (left === null) {
        if (!Number.isFinite(num)) return;
        left = num;
      } else if (op && entry !== "") {
        const out = compute(left, num, op);
        if (!Number.isFinite(out)) {
          display.value = "Erreur";
          entry = "0";
          left = null;
          op = null;
          justEvaluated = true;
          return;
        }
        left = out;
      }

      op = nextOp;
      entry = "";
      render();
    };

    const clearEntry = () => {
      if (justEvaluated) {
        entry = "0";
        left = null;
        op = null;
        justEvaluated = false;
        render();
        return;
      }
      entry = "0";
      render();
    };

    const backspace = () => {
      if (justEvaluated) return;
      if (entry === "") return;
      if (entry.length <= 1) entry = "0";
      else entry = entry.slice(0, -1);
      render();
    };

    const clearAll = () => {
      entry = "0";
      left = null;
      op = null;
      justEvaluated = false;
      render();
    };

    const equals = () => {
      const num = entry === "" ? NaN : asNumber(entry);
      if (left === null || !op || !Number.isFinite(num)) return;
      const out = compute(left, num, op);
      if (!Number.isFinite(out)) {
        display.value = "Erreur";
        entry = "0";
        left = null;
        op = null;
        justEvaluated = true;
        return;
      }
      display.value = `${left} ${opLabel(op)} ${entry} = ${out}`;
      entry = String(out);
      left = null;
      op = null;
      justEvaluated = true;
    };

    const onKey = (k) => {
      if (/^\d$/.test(k) || k === "." || k === "00") return addDigit(k);
      if (k === "CE") return clearEntry();
      if (k === "C") return clearAll();
      if (k === "⌫") return backspace();
      if (k === "=") return equals();
      if (k === "+" || k === "-" || k === "×" || k === "÷") return applyOp(k);
    };

    for (const key of keys) {
      if (!(key instanceof HTMLButtonElement)) continue;
      key.addEventListener("click", () => {
        const k = key.getAttribute("data-inline-calc-key") || "";
        if (!k) return;
        onKey(k);
      });
    }

    panel.addEventListener("keydown", (e) => {
      if (panel.hidden) return;
      const k = e.key;
      if (/^\d$/.test(k)) {
        e.preventDefault();
        onKey(k);
        return;
      }
      if (k === "." || k === ",") {
        e.preventDefault();
        onKey(".");
        return;
      }
      if (k === "Backspace") {
        e.preventDefault();
        onKey("⌫");
        return;
      }
      if (k === "Enter" || k === "=") {
        e.preventDefault();
        onKey("=");
        return;
      }
      if (k === "+" || k === "-") {
        e.preventDefault();
        onKey(k);
        return;
      }
      if (k === "*" ) {
        e.preventDefault();
        onKey("×");
        return;
      }
      if (k === "/") {
        e.preventDefault();
        onKey("÷");
        return;
      }
      if (k === "Escape") {
        e.preventDefault();
        panel.hidden = true;
      }
      if (k.toLowerCase() === "c") {
        e.preventDefault();
        onKey("C");
      }
    });

    render();
  }
}

export function mountM2Calculator() {
  const panels = Array.from(document.querySelectorAll("[data-m2-calc]"));
  if (!panels.length) return;

  const formatCHF0 = (n) =>
    new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(n);

  for (const panel of panels) {
    if (!(panel instanceof HTMLElement)) continue;
    const step = panel.closest(".advice-step");
    if (!(step instanceof HTMLElement)) continue;

    const price = panel.querySelector("[data-m2-price]");
    const surface = panel.querySelector("[data-m2-surface]");
    const out = panel.querySelector("[data-m2-result]");
    const ref = panel.querySelector("[data-m2-ref]");
    if (!(price instanceof HTMLInputElement)) continue;
    if (!(surface instanceof HTMLInputElement)) continue;
    if (!(out instanceof HTMLElement)) continue;
    if (!(ref instanceof HTMLInputElement)) continue;

    const recompute = () => {
      const p = Math.max(0, Number(price.value || 0));
      const s = Math.max(0, Number(surface.value || 0));
      if (!p || !s) {
        out.textContent = "—";
        return;
      }
      const m2 = p / s;
      out.textContent = `${formatCHF0(m2)}/m²`;
    };

    price.addEventListener("input", recompute);
    surface.addEventListener("input", recompute);
    price.addEventListener("focus", recompute);
    surface.addEventListener("focus", recompute);
    recompute();
  }
}

export function mountRentMaxCalculator() {
  const panels = Array.from(document.querySelectorAll("[data-rent-calc]"));
  if (!panels.length) return;

  const formatCHF0 = (n) =>
    new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(n);

  for (const panel of panels) {
    if (!(panel instanceof HTMLElement)) continue;
    const step = panel.closest(".advice-step");
    if (!(step instanceof HTMLElement)) continue;

    const income = panel.querySelector("[data-rent-income]");
    const out = panel.querySelector("[data-rent-result]");
    if (!(income instanceof HTMLInputElement)) continue;
    if (!(out instanceof HTMLInputElement)) continue;

    const recompute = () => {
      const inc = Math.max(0, Number(income.value || 0));
      if (!inc) {
        out.value = "—";
        return;
      }
      const max = inc * 0.33;
      out.value = `${formatCHF0(max)}/mois`;
    };

    income.addEventListener("input", recompute);
    income.addEventListener("focus", recompute);
    recompute();
  }
}

export function mountRateCalculator() {
  const panels = Array.from(document.querySelectorAll("[data-mortgage-calc]"));
  if (!panels.length) return;

  const formatCHF0 = (n) =>
    new Intl.NumberFormat("fr-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(n);
  const formatPct1 = (n) => new Intl.NumberFormat("fr-CH", { style: "percent", maximumFractionDigits: 1 }).format(n);
  const toMoneyNumber = (raw) => {
    const src = String(raw ?? "").trim().replace(/\s/g, "").replace(/'/g, "");
    if (!src) return 0;
    let normalized = src;
    const hasComma = normalized.includes(",");
    const hasDot = normalized.includes(".");
    if (hasComma && hasDot) {
      if (normalized.lastIndexOf(",") > normalized.lastIndexOf(".")) {
        normalized = normalized.replace(/\./g, "").replace(",", ".");
      } else {
        normalized = normalized.replace(/,/g, "");
      }
    } else if (hasComma) {
      normalized = /,\d{1,2}$/.test(normalized) ? normalized.replace(",", ".") : normalized.replace(/,/g, "");
    } else if (hasDot) {
      normalized = /\.\d{1,2}$/.test(normalized) ? normalized : normalized.replace(/\./g, "");
    }
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  };
  const toRateNumber = (raw) => {
    const normalized = String(raw ?? "").trim().replace(/\s/g, "").replace(/'/g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  };

  for (const panel of panels) {
    if (!(panel instanceof HTMLElement)) continue;
    const step = panel.closest(".advice-step");
    if (!(step instanceof HTMLElement)) continue;

    const amount = panel.querySelector("[data-mortgage-amount]");
    const rate = panel.querySelector("[data-mortgage-rate]");
    const outMonth = panel.querySelector("[data-mortgage-interest-month]");
    const outYear = panel.querySelector("[data-mortgage-interest-year]");
    const amortChf = panel.querySelector("[data-mortgage-amort-chf]");
    const maint = panel.querySelector("[data-mortgage-maint]");
    const income = panel.querySelector("[data-mortgage-income]");
    const outAmortMonth = panel.querySelector("[data-mortgage-amort-month]");
    const outMaintMonth = panel.querySelector("[data-mortgage-maint-month]");
    const outTotalMonth = panel.querySelector("[data-mortgage-total-month]");
    const outRatio = panel.querySelector("[data-mortgage-ratio]");
    if (!(amount instanceof HTMLInputElement)) continue;
    if (!(rate instanceof HTMLInputElement)) continue;
    if (!(outMonth instanceof HTMLElement)) continue;
    const outYearEl = outYear instanceof HTMLElement ? outYear : null;
    if (!(amortChf instanceof HTMLInputElement)) continue;
    if (!(maint instanceof HTMLInputElement)) continue;
    if (!(income instanceof HTMLInputElement)) continue;
    if (!(outAmortMonth instanceof HTMLElement)) continue;
    if (!(outMaintMonth instanceof HTMLElement)) continue;
    if (!(outTotalMonth instanceof HTMLElement)) continue;
    if (!(outRatio instanceof HTMLElement)) continue;

    const recompute = () => {
      const P = Math.max(0, toMoneyNumber(amount.value));
      const rYear = Math.max(0, toRateNumber(rate.value)) / 100;
      const amortRaw = Math.max(0, toRateNumber(amortChf.value));
      const mYear = Math.max(0, toRateNumber(maint.value)) / 100;
      const inc = Math.max(0, toMoneyNumber(income.value));
      if (!P || !Number.isFinite(rYear)) {
        outMonth.textContent = "—";
        if (outYearEl) outYearEl.textContent = "—";
        outAmortMonth.textContent = "—";
        outMaintMonth.textContent = "—";
        outTotalMonth.textContent = "—";
        outRatio.textContent = "—";
        return;
      }
      const interestYear = P * rYear;
      // Flexible input:
      // - if value <= 15 => interpreted as annual % of mortgage amount
      // - if value > 15  => interpreted as yearly CHF amount
      const amortYear = amortRaw <= 15 ? P * (amortRaw / 100) : amortRaw;
      const maintYear = P * (Number.isFinite(mYear) ? mYear : 0);

      // Round each monthly component first so displayed parts always match displayed total.
      const interestMonth = Math.round(interestYear / 12);
      const amortMonth = Math.round(amortYear / 12);
      const maintMonth = Math.round(maintYear / 12);
      const totalMonth = interestMonth + amortMonth + maintMonth;

      outMonth.textContent = formatCHF0(interestMonth);
      if (outYearEl) outYearEl.textContent = formatCHF0(interestYear);
      outAmortMonth.textContent = formatCHF0(amortMonth);
      outMaintMonth.textContent = formatCHF0(maintMonth);
      outTotalMonth.textContent = formatCHF0(totalMonth);

      if (!inc) {
        outRatio.textContent = "—";
      } else {
        outRatio.textContent = formatPct1(totalMonth / inc);
      }
    };

    amount.addEventListener("input", recompute);
    rate.addEventListener("input", recompute);
    amortChf.addEventListener("input", recompute);
    maint.addEventListener("input", recompute);
    income.addEventListener("input", recompute);
    amount.addEventListener("focus", recompute);
    rate.addEventListener("focus", recompute);
    amortChf.addEventListener("focus", recompute);
    maint.addEventListener("focus", recompute);
    income.addEventListener("focus", recompute);
    recompute();
  }
}

export function formatCHF(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const locale = getLang() === "en" ? "en-CH" : "fr-CH";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(n);
}

export function formatRooms(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (getLang() === "en") return `${n.toString()} rm`;
  return `${n.toString().replace(".", ",")} p.`;
}

export function showToast(message) {
  const el = document.querySelector("[data-toast]");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 3200);
}

export function mountConstructionToasts() {
  const targets = Array.from(document.querySelectorAll("[data-construction-toast]"));
  if (!targets.length) return;
  for (const el of targets) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.dataset.boundConstructionToast === "1") continue;
    el.dataset.boundConstructionToast = "1";

    const getMsg = () => {
      const raw = (el.getAttribute("data-construction-toast") || "").trim();
      if (!raw) return t("toast.construction");
      if (getLang() === "en" && raw.toLowerCase() === "site en construction") return t("toast.construction");
      return raw;
    };
    const fire = () => showToast(getMsg());

    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fire();
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fire();
      }
    });
  }
}

export function wireForms() {
  const getDemoLabel = (form) => {
    const raw = (form.getAttribute("data-demo-form") || "").trim();
    if (getLang() === "en") {
      if (raw === "Demande de dossier") return t("nav.dossier");
      if (raw === "Newsletter") return t("footer.newsletter");
      if (raw === "Contact") return t("nav.contact");
      if (raw === "Formulaire") return "Form";
      if (raw === "Formulaire de contact") return "Contact form";
    }
    return raw || "Formulaire";
  };

  const toggleContactAttachments = (form) => {
    if (!(form instanceof HTMLFormElement)) return;
    const requestType = form.querySelector("#contact-request-type");
    const box = form.querySelector("[data-attachments-field]");
    if (!(requestType instanceof HTMLSelectElement)) return;
    if (!(box instanceof HTMLElement)) return;

    const apply = () => {
      const isDossier = requestType.value === "Demande de dossier";
      box.hidden = !isDossier;
    };

    requestType.addEventListener("change", apply);
    apply();
  };

  const mountFilePickers = (form) => {
    if (!(form instanceof HTMLFormElement)) return;
    const fields = Array.from(form.querySelectorAll("[data-file-field]"));
    for (const field of fields) {
      if (!(field instanceof HTMLElement)) continue;
      const input = field.querySelector("input[type=\"file\"]");
      const label = field.querySelector("[data-file-label]");
      if (!(input instanceof HTMLInputElement)) continue;
      if (!(label instanceof HTMLElement)) continue;

      const render = () => {
        const files = Array.from(input.files || []);
        if (!files.length) {
          label.textContent = t("files.none");
          return;
        }
        if (files.length === 1) {
          label.textContent = files[0]?.name || t("files.one");
          return;
        }
        label.textContent = t("files.many", { count: files.length });
      };

      input.addEventListener("change", render);
      render();
    }
  };

  for (const form of document.querySelectorAll("form[data-demo-form]")) {
    form.addEventListener("submit", (e) => {
      const endpoint = (form.getAttribute("data-form-endpoint") || "").trim();
      if (endpoint) {
        e.preventDefault();
        const label = getDemoLabel(form);
        const submitBtn = form.querySelector("button[type=\"submit\"]");
        if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;

        const fd = new FormData(form);
        fetch(endpoint, { method: "POST", body: fd })
          .then((r) => {
            if (!r.ok) throw new Error("Bad status");
            showToast(t("toast.form.sent", { label }));
            form.reset();
          })
          .catch(() => {
            showToast(t("toast.form.fail"));
          })
          .finally(() => {
            if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
          });
        return;
      }

      e.preventDefault();
      const label = getDemoLabel(form);
      showToast(t("toast.form.demo", { label }));
    });

    toggleContactAttachments(form);
    mountFilePickers(form);
  }
}

export function mountAppointmentPlanner() {
  const SWISS_TZ = "Europe/Zurich";

  const getSwissParts = (d) => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: SWISS_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    });
    const parts = fmt.formatToParts(d);
    const get = (type) => parts.find((p) => p.type === type)?.value || "";
    return {
      year: get("year"),
      month: get("month"),
      day: get("day"),
      hour: get("hour"),
      minute: get("minute")
    };
  };

  const rdvLinks = Array.from(document.querySelectorAll("[data-rdv-link]"));
  for (const link of rdvLinks) {
    if (!(link instanceof HTMLAnchorElement)) continue;
    link.addEventListener("click", () => {
      const rawHref = link.getAttribute("href");
      if (!rawHref) return;
      const target = new URL(rawHref, window.location.href);
      target.searchParams.set("rdvts", String(Date.now()));
      link.setAttribute("href", target.toString());
    });
  }

  const formatDate = (raw) => {
    const [y, m, d] = raw.split("-").map(Number);
    if (!y || !m || !d) return "";
    const dd = String(d).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${dd}.${mm}`;
  };

  const toSwissDateValue = (d) => {
    const p = getSwissParts(d);
    return `${p.year}-${p.month}-${p.day}`;
  };

  const toSwissTimeValue = (d) => {
    const p = getSwissParts(d);
    return `${p.hour}:${p.minute}`;
  };

  const todaySwiss = getSwissParts(new Date());
  const minDate = `${todaySwiss.year}-${todaySwiss.month}-${todaySwiss.day}`;

  const contexts = [];
  for (const form of document.querySelectorAll("form")) {
    if (!(form instanceof HTMLFormElement)) continue;
    const planner = form.querySelector("[data-appointment-planner]");
    const dateInput = form.querySelector("[data-appointment-date]");
    const timeInput = form.querySelector("[data-appointment-time]");
    const messageInput = form.querySelector("[data-appointment-message]") || form.querySelector("#contact-message");
    const requestType = form.querySelector("[data-appointment-request-type]") || form.querySelector("#contact-request-type");
    if (!(planner instanceof HTMLElement)) continue;
    if (!(dateInput instanceof HTMLInputElement)) continue;
    if (!(timeInput instanceof HTMLInputElement)) continue;
    if (!(messageInput instanceof HTMLTextAreaElement)) continue;

    dateInput.min = minDate;

    contexts.push({ form, planner, dateInput, timeInput, messageInput, requestType, openPlanner: null });
  }

  if (!contexts.length) return;

  const getListingRef = () => {
    const qp = new URLSearchParams(window.location.search);
    const id = (qp.get("id") || "").trim();
    if (id) return id;
    return "";
  };

  const triggers = Array.from(document.querySelectorAll("[data-open-appointment]"));

  for (const ctx of contexts) {
    let openedByUser = false;

    const clearAutoMessage = () => {
      const prev = ctx.messageInput.dataset.autoRdvMsg || "";
      if (!prev) return;
      const cleaned = ctx.messageInput.value
        .replace(prev, "")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd();
      ctx.messageInput.value = cleaned;
      delete ctx.messageInput.dataset.autoRdvMsg;
    };

    const isVisitRequest = () => {
      if (!(ctx.requestType instanceof HTMLSelectElement)) return true;
      return ctx.requestType.value === "Demande de visite";
    };

    const hidePlanner = () => {
      ctx.planner.hidden = true;
      ctx.planner.classList.remove("is-open");
      clearAutoMessage();
      ctx.dateInput.value = "";
      ctx.timeInput.value = "";
    };

    const applyAutoMessage = () => {
      clearAutoMessage();
      if (!openedByUser) return;
      if (!isVisitRequest()) return;
      if (!ctx.dateInput.value || !ctx.timeInput.value) return;

      const dateLabel = formatDate(ctx.dateInput.value);
      const ref = getListingRef();
      const refSuffix = ref ? t("appointment.refSuffix", { ref }) : "";
      const msg = t("appointment.autoVisitMsg", { date: dateLabel, time: ctx.timeInput.value, refSuffix });
      const base = ctx.messageInput.value.trimEnd();
      ctx.messageInput.value = base ? `${base}\n\n${msg}` : msg;
      ctx.messageInput.dataset.autoRdvMsg = msg;
    };

    const openPlanner = (when = new Date(), opts = {}) => {
      const focus = opts && Object.prototype.hasOwnProperty.call(opts, "focus") ? Boolean(opts.focus) : true;
      openedByUser = true;
      ctx.planner.hidden = false;
      ctx.planner.classList.add("is-open");
      if (ctx.requestType instanceof HTMLSelectElement) {
        ctx.requestType.value = "Demande de visite";
      }
      ctx.dateInput.value = toSwissDateValue(when);
      ctx.timeInput.value = toSwissTimeValue(when);
      applyAutoMessage();
      if (focus) {
        window.setTimeout(() => {
          try {
            ctx.dateInput.focus({ preventScroll: true });
          } catch {
            ctx.dateInput.focus();
          }
        }, 120);
      }
    };

    ctx.openPlanner = openPlanner;

    ctx.dateInput.addEventListener("change", applyAutoMessage);
    ctx.timeInput.addEventListener("change", applyAutoMessage);

    if (ctx.requestType instanceof HTMLSelectElement) {
      ctx.requestType.addEventListener("change", () => {
        if (!openedByUser) {
          if (!isVisitRequest()) return;
          openPlanner(new Date());
          return;
        }
        if (!isVisitRequest()) hidePlanner();
        else applyAutoMessage();
      });
    }

    ctx.form.addEventListener("reset", () => {
      window.setTimeout(() => {
        openedByUser = false;
        hidePlanner();
      }, 0);
    });

    ctx.form.addEventListener("submit", () => {
      openedByUser = false;
    });

    const rdvTs = new URLSearchParams(window.location.search).get("rdvts");
    if (rdvTs) {
      const stamp = Number(rdvTs);
      const clickedAt = Number.isFinite(stamp) && stamp > 0 ? new Date(stamp) : new Date(rdvTs);
      if (!Number.isNaN(clickedAt.getTime())) {
        openPlanner(clickedAt, { focus: false });
      }
    }
  }

  if (triggers.length) {
    for (const trigger of triggers) {
      trigger.addEventListener("click", (e) => {
        if (trigger instanceof HTMLAnchorElement) {
          const href = trigger.getAttribute("href") || "";
          if (href.startsWith("#")) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }

        const targetFormId = trigger.getAttribute("data-appointment-target") || "";
        const targetCtx = targetFormId ? contexts.find((c) => c.form.id === targetFormId) : contexts[0];
        targetCtx?.openPlanner?.(new Date());
      });
    }
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
  a.setAttribute("aria-label", t("top.backToTop"));
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

function normalizeKey(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function iconSvg(key) {
  switch (key) {
    case "floor":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>`;
    case "bath":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"></path><path d="M5 12V7a3 3 0 0 1 3-3h3"></path><path d="M19 12v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6"></path><path d="M8 4h3"></path></svg>`;
    case "new":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.2 3.7L17 7l-3.8 1.3L12 12l-1.2-3.7L7 7l3.8-1.3L12 2Z"></path><path d="M19 13l.9 2.6L22 16l-2.1.4L19 19l-.9-2.6L16 16l2.1-.4L19 13Z"></path><path d="M5 14l.9 2.6L8 17l-2.1.4L5 20l-.9-2.6L2 17l2.1-.4L5 14Z"></path></svg>`;
    case "parking":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16l1.5-6h11L19 16"></path><path d="M7.5 10h9"></path><circle cx="7.5" cy="16.5" r="1.4"></circle><circle cx="16.5" cy="16.5" r="1.4"></circle></svg>`;
    case "leaf":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c6-1 10-5 12-11"></path><path d="M7 17c-3-3-3-8 0-11 7 0 11 4 11 11-3 3-8 3-11 0Z"></path></svg>`;
    case "tree":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3.4 2 5.6 4.6 5.6 7.6a5.6 5.6 0 0 1-11.2 0C6.4 6.6 8.6 4 12 2Z"></path><path d="M12 15v7"></path><path d="M8.5 22h7"></path></svg>`;
    case "kids":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="3.2"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.7"></path><path d="M16.6 3.3a3.2 3.2 0 0 1 0 6.2"></path></svg>`;
    case "pin":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
    case "kitchen":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"></rect><path d="M4 10h16"></path><path d="M9 7h.01"></path><path d="M15 7h.01"></path><path d="M9 14h.01"></path><path d="M15 14h.01"></path><path d="M9.2 20v-6"></path><path d="M14.8 20v-6"></path></svg>`;
    case "balcony":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="3" width="10" height="9" rx="2"></rect><path d="M5 14h14"></path><path d="M5 21h14"></path><path d="M7 14v7"></path><path d="M10 14v7"></path><path d="M14 14v7"></path><path d="M17 14v7"></path></svg>`;
    case "garage":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 5l8 6v10H4V11Z"></path><path d="M7 21v-6h10v6"></path><path d="M7 15h10"></path><path d="M10 15v6"></path><path d="M12 15v6"></path><path d="M14 15v6"></path></svg>`;
    case "box":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"></path><path d="M3.3 7.3 12 12l8.7-4.7"></path><path d="M12 22V12"></path></svg>`;
    case "washer":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="3"></rect><circle cx="12" cy="13.2" r="3.6"></circle><path d="M9 6.2h6"></path><circle cx="9.2" cy="5.4" r=".55"></circle><circle cx="14.8" cy="5.4" r=".55"></circle></svg>`;
    case "lift":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M8 6l4-4 4 4"></path><path d="M16 18l-4 4-4-4"></path></svg>`;
    case "wifi":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.6a11 11 0 0 1 14 0"></path><path d="M8.5 15.6a6 6 0 0 1 7 0"></path><path d="M12 19.5h.01"></path></svg>`;
    case "sun":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.2 4.2l1.4 1.4"></path><path d="M18.4 18.4l1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M4.2 19.8l1.4-1.4"></path><path d="M18.4 5.6l1.4-1.4"></path></svg>`;
    case "wind":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h10a3 3 0 1 0-3-3"></path><path d="M4 17h13a3 3 0 1 1-3 3"></path><path d="M2 7h9a3 3 0 1 1-3 3"></path></svg>`;
    case "flame":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-8 0 2-2 3-3 4-1-1-2-2-2-4-3 3-5 5-5 8 0 4 3 7 7 7Z"></path></svg>`;
    case "tool":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a4.5 4.5 0 0 0 6.4-6.4l-2 2-3-3 2-2Z"></path></svg>`;
    case "shield":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4Z"></path><path d="M9 12l2 2 4-4"></path></svg>`;
    case "eye":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    case "mountain":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19l7-10 4 6 3-4 4 8H3Z"></path><path d="M10 9l1.6 2.4"></path></svg>`;
    case "bike":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="17.5" r="3"></circle><circle cx="17.5" cy="17.5" r="3"></circle><path d="M8 17.5l4-9h3l2 4"></path><path d="M12 8.5h-2"></path><path d="M14 8.5l-1.6 3.6"></path></svg>`;
    case "paw":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2.2 0-4 1.6-4 3.6S9.8 20 12 20s4-1.4 4-4.4S14.2 12 12 12Z"></path><path d="M9 11c-1 0-2-.9-2-2s1-2 2-2 2 .9 2 2-1 2-2 2Z"></path><path d="M15 11c-1 0-2-.9-2-2s1-2 2-2 2 .9 2 2-1 2-2 2Z"></path><path d="M6.8 13.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"></path><path d="M17.2 13.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"></path></svg>`;
    case "drop":
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z"></path></svg>`;
    default:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`;
  }
}

function getTagIconKey(label) {
  const k = normalizeKey(label);
  if (!k) return "";

  if (
    k.startsWith("etage") ||
    k.startsWith("floor") ||
    k.startsWith("level") ||
    k.includes("rez-de-chaussee") ||
    k === "rdc" ||
    k.includes("attique") ||
    k.includes("duplex")
  ) {
    return "floor";
  }

  if (
    k.includes("sdb") ||
    k.includes("salle de bain") ||
    k.includes("bain") ||
    k.includes("douche") ||
    k.includes("bath") ||
    k.includes("bathroom") ||
    k.includes("shower")
  ) {
    return "bath";
  }

  if (k.includes("cuisine") || k.includes("kitchen")) return "kitchen";

  if (
    k.includes("cave") ||
    k.includes("cellar") ||
    k.includes("grenier") ||
    k.includes("attic") ||
    k.includes("combles") ||
    k.includes("dressing") ||
    k.includes("walk-in") ||
    k.includes("cellier") ||
    k.includes("storage") ||
    k.includes("sous-sol") ||
    k.includes("basement") ||
    k.includes("cabanon") ||
    k.includes("shed") ||
    k.includes("coins rangement")
  ) {
    return "box";
  }

  if (
    k.includes("balcon") ||
    k.includes("balcony") ||
    k.includes("terrasse") ||
    k.includes("terrace") ||
    k.includes("loggia") ||
    k.includes("cour") ||
    k.includes("courtyard")
  ) {
    return "balcony";
  }

  if (k.includes("jardin") || k.includes("garden") || k.includes("verdoyant")) return "tree";

  if (k.includes("garage") || k.includes("double garage") || k.includes("garage box")) return "garage";

  if (
    k.includes("parking") ||
    k.includes("place de parc") ||
    k.includes("place couverte") ||
    k.includes("place exterieure") ||
    k.includes("places exterieures") ||
    k.includes("parking space") ||
    k.includes("outdoor parking") ||
    k.includes("covered parking")
  ) {
    return "parking";
  }

  if (k.includes("local velo") || k.includes("velos") || k.includes("bike")) return "bike";

  if (k.includes("buanderie") || k.includes("laverie") || k.includes("laundry")) return "washer";

  if (k.includes("ascenseur") || k.includes("elevator") || k.includes("lift")) return "lift";

  if (k.includes("fibre") || k.includes("fiber") || k.includes("wifi") || k.includes("internet") || k.includes("domotique")) return "wifi";

  if (
    k.includes("panneaux") ||
    k.includes("solaire") ||
    k.includes("solar") ||
    k.includes("orientation sud") ||
    k.includes("south") ||
    k === "sud" ||
    k.includes("minergie") ||
    k.includes("lumineux") ||
    k.includes("bright")
  ) {
    return "sun";
  }

  if (k.includes("pompe a chaleur") || k.includes("heat pump") || k === "pompe") return "wind";

  if (k.includes("cheminee") || k.includes("fireplace") || k.includes("poele") || k.includes("wood stove") || k.includes("chauffage")) return "flame";

  if (
    k.includes("renove") ||
    k.includes("renovee") ||
    k.includes("renovation") ||
    k.includes("renovated") ||
    k.includes("double vitrage") ||
    k.includes("double glazing") ||
    k.includes("stores") ||
    k.includes("blinds") ||
    k.includes("portail") ||
    k.includes("gate") ||
    k.includes("moderne") ||
    k.includes("modern") ||
    k.includes("atelier") ||
    k.includes("workshop") ||
    k.includes("bureau") ||
    k.includes("office") ||
    k.includes("arrosage") ||
    k.includes("irrigation") ||
    k.includes("loft") ||
    k.includes("industriel") ||
    k.includes("industrial") ||
    k.includes("parquet") ||
    k.includes("wood flooring") ||
    k.includes("beton") ||
    k.includes("concrete") ||
    k.includes("carrelage") ||
    k.includes("tile") ||
    k.includes("meuble") ||
    k.includes("furnished") ||
    k.includes("charges comprises") ||
    k.includes("utilities included")
  ) {
    return "tool";
  }

  if (k.includes("piscine") || k.includes("pool") || k.includes("spa") || k.includes("jacuzzi")) return "drop";

  if (k.includes("animaux") || k.includes("pets") || k.includes("equestre") || k.includes("equestrian")) return "paw";

  if (k.includes("interphone") || k.includes("security") || k.includes("porte securisee") || k.includes("securisee") || k.includes("secure") || k.includes("camera")) return "shield";

  if (k.includes("vue degagee") || k.includes("open view") || k.includes("vue montagne") || k.includes("mountain") || k.includes("vue campagne") || k.includes("countryside") || k.includes("panoram")) return "mountain";

  if (
    k.includes("centre") ||
    k.includes("centre-ville") ||
    k.includes("downtown") ||
    k.includes("city center") ||
    k.includes("proche") ||
    k.includes("near") ||
    k.includes("gare") ||
    k.includes("station") ||
    k.includes("ecoles") ||
    k.includes("schools") ||
    k.includes("commerces") ||
    k.includes("shops") ||
    k.includes("autoroute") ||
    k.includes("highway")
  ) {
    return "pin";
  }

  if (k.includes("calme") || k.includes("quiet")) return "leaf";

  if (
    k.includes("enfants") ||
    k.includes("children") ||
    k.includes("child") ||
    k.includes("quartier familial") ||
    k.includes("family-friendly")
  ) {
    return "kids";
  }

  if (k.includes("neuf") || k.includes("new build") || k.includes("nouvelle construction") || k.includes("recent") || k === "new") return "new";

  return "";
}

export function mountTagIcons(root = document) {
  const scope = root && typeof root.querySelectorAll === "function" ? root : document;
  for (const el of Array.from(scope.querySelectorAll(".tag"))) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.querySelector(".tag-ico")) continue;
    const label = (el.textContent || "").trim();
    const key = getTagIconKey(label);
    if (!key) continue;

    const span = document.createElement("span");
    span.className = "tag-ico";
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = iconSvg(key);
    el.prepend(span);
  }
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
  const listing = stateListings?.get(id);
  if (!listing) return fallback;
  return getListingPhotos(listing, 10);
}

let stateListings = null;

export function mountCardGalleries() {
  (async () => {
    if (!stateListings) {
      try {
        const listings = await loadListings();
        stateListings = new Map(listings.map((l) => [l.id, l]));
      } catch {
        stateListings = new Map();
      }
    }

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
  })();
}

export function mountReveals() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = [
    ...document.querySelectorAll("main > section:not(.hero):not([data-reveal-skip])"),
    ...document.querySelectorAll("[data-reveal]"),
  ];
  if (!targets.length) return;

  const unique = Array.from(new Set(targets));

  if (!("IntersectionObserver" in window)) return;

  let io = null;
  try {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
  } catch {
    return;
  }

  for (const el of unique) {
    el.classList.add("reveal");
    io.observe(el);
  }
}

export function mountTypewriters() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = Array.from(document.querySelectorAll("[data-typewriter]"));
  if (!els.length) return;

  const start = (el) => {
    if (!(el instanceof HTMLElement)) return;
    if (el.dataset.typewriterStarted === "1") return;
    if (el.childElementCount > 0) return;
    const full = String(el.textContent || "");
    if (!full.trim()) return;

    el.dataset.typewriterStarted = "1";

    const rect = el.getBoundingClientRect();
    const h = Math.ceil(rect.height);
    if (h > 0) el.style.minHeight = `${h}px`;

    const speed = Math.max(10, Number(el.getAttribute("data-typewriter-speed") || "26"));
    const delay = Math.max(0, Number(el.getAttribute("data-typewriter-delay") || "120"));

    el.textContent = "";
    el.classList.add("typewriter", "is-typing");

    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      el.textContent = full.slice(0, i);
      if (i >= full.length) {
        window.clearInterval(timer);
        el.classList.remove("is-typing");
        window.setTimeout(() => {
          el.style.minHeight = "";
        }, 60);
      }
    };

    const startTimer = () => {
      timer = window.setInterval(tick, speed);
    };

    if (delay) window.setTimeout(startTimer, delay);
    else startTimer();
  };

  if (!("IntersectionObserver" in window)) {
    for (const el of els) start(el);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        start(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.3, rootMargin: "0px 0px -12% 0px" }
  );

  for (const el of els) io.observe(el);
}

export function mountDossierPrefill() {
  const form = document.querySelector("form[data-demo-form=\"Demande de dossier\"]");
  if (!(form instanceof HTMLFormElement)) return;

  const qp = new URLSearchParams(window.location.search);
  const type = (qp.get("type") || "").trim();
  const id = (qp.get("id") || "").trim();

  const typeSelect = form.querySelector("select[name=\"type\"]");
  const refInput = form.querySelector("input[name=\"ref\"]");

  if (typeSelect instanceof HTMLSelectElement && type) {
    const raw = type.toLowerCase();
    const normalized =
      raw === "achat" || raw === "buy" || raw === "sale"
        ? "Achat"
        : raw === "location" || raw === "rent" || raw === "rental"
          ? "Location"
          : "";
    if (normalized) {
      typeSelect.value = normalized;
      for (const opt of Array.from(typeSelect.options)) {
        if (opt.value !== normalized) opt.remove();
      }
    }
  }

  if (refInput instanceof HTMLInputElement && id) {
    if (!refInput.value) refInput.value = id;
  }

  if (id) {
    (async () => {
      try {
        const listings = await loadListings();
        const listing = listings.find((l) => l.id === id);
        if (!listing) return;
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
        if (!statusLabel) return;

        const note = document.createElement("div");
        note.className = "unavailable-note";
        note.style.marginBottom = "12px";
        note.innerHTML = `
          <div class="badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div class="t">
            <div class="k">${t("listing.unavailableTitle")}</div>
            <div class="v">${t("listing.unavailableMsg", { status: statusLabel })}</div>
          </div>
        `;
        form.prepend(note);

        form.classList.add("is-disabled");
        const controls = form.querySelectorAll("input, select, textarea, button");
        for (const el of Array.from(controls)) {
          if (el instanceof HTMLInputElement) el.disabled = true;
          else if (el instanceof HTMLSelectElement) el.disabled = true;
          else if (el instanceof HTMLTextAreaElement) el.disabled = true;
          else if (el instanceof HTMLButtonElement) el.disabled = true;
        }
      } catch {}
    })();
  }
}

export function mountCountUps() {
  const els = [...document.querySelectorAll("[data-count-to]")];
  if (!els.length) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateRing = (valueEl) => {
    const ring =
      valueEl.parentElement?.querySelector?.(".kpi-ring") ||
      valueEl.closest?.(".kpi-item, .advice-kpi-item")?.querySelector?.(".kpi-ring");
    if (!ring) return;
    const fg = ring.querySelector(".kpi-fg");
    if (!(fg instanceof SVGCircleElement)) return;

    const raw = ring.getAttribute("data-kpi-progress");
    const progress = Math.max(0, Math.min(100, Number(raw ?? "100")));
    if (!Number.isFinite(progress)) return;

    const valueDuration = Number(valueEl.getAttribute("data-count-duration") || "1200");
    const ringDuration = Number(ring.getAttribute("data-kpi-duration") || String(valueDuration * 1.8));
    const duration = Number.isFinite(ringDuration) ? ringDuration : valueDuration;

    const len = fg.getTotalLength();
    fg.style.strokeDasharray = `${len}`;

    const to = len * (1 - progress / 100);
    if (reduced) {
      fg.style.strokeDashoffset = `${to}`;
      return;
    }

    const start = performance.now();
    const from = len;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * easeOutCubic(p);
      fg.style.strokeDashoffset = `${v}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const format = (n, decimals) => {
    const nf = new Intl.NumberFormat(getLang() === "en" ? "en-CH" : "fr-CH", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return nf.format(n);
  };

  const setText = (el, n) => {
    const to = Number(el.getAttribute("data-count-to") || "0");
    const decimals = Number(el.getAttribute("data-count-decimals") || (Number.isInteger(to) ? 0 : 1));
    const prefix = el.getAttribute("data-count-prefix") || "";
    const suffix = el.getAttribute("data-count-suffix") || "";
    const value = decimals === 0 ? Math.round(n) : Number(n.toFixed(decimals));
    el.textContent = `${prefix}${format(value, decimals)}${suffix}`;
  };

  for (const el of els) setText(el, 0);

  const animate = (el) => {
    const to = Number(el.getAttribute("data-count-to") || "0");
    const duration = Number(el.getAttribute("data-count-duration") || "1200");
    if (!Number.isFinite(to)) return;
    if (reduced) {
      setText(el, to);
      animateRing(el);
      return;
    }

    const start = performance.now();
    const from = 0;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * easeOutCubic(p);
      setText(el, v);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    animateRing(el);
  };

  const started = new WeakSet();

  if (!("IntersectionObserver" in window)) {
    for (const el of els) animate(el);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (started.has(e.target)) continue;
        started.add(e.target);
        animate(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.35 }
  );

  for (const el of els) io.observe(el);
}

export function mountTestimonials() {
  const roots = [...document.querySelectorAll("[data-testimonials]")];
  if (!roots.length) return;

  const reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  for (const root of roots) {
    if (root.dataset.bound === "1") continue;
    root.dataset.bound = "1";

    const track = root.querySelector("[data-testimonials-track]");
    const dotsWrap = root.querySelector("[data-testimonials-dots]");
    const prev = root.querySelector("[data-testimonials-prev]");
    const next = root.querySelector("[data-testimonials-next]");
    if (!track || !dotsWrap) continue;

    const slides = [...track.children].filter((n) => n.nodeType === 1);
    if (!slides.length) continue;

    let idx = 0;
    let timer = null;
    let paused = false;
    const AUTOPLAY_MS = 3800;

    const setIndex = (n) => {
      const len = slides.length;
      idx = ((n % len) + len) % len;
      track.style.transform = `translateX(${-idx * 100}%)`;
      for (let i = 0; i < dotsWrap.children.length; i += 1) {
        dotsWrap.children[i].classList.toggle("active", i === idx);
      }
    };

    dotsWrap.innerHTML = "";
    for (let i = 0; i < slides.length; i += 1) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "testimonials-dot";
      b.setAttribute("aria-label", t("aria.reviewGo", { n: i + 1 }));
      b.addEventListener("click", () => {
        setIndex(i);
        restart();
      });
      dotsWrap.appendChild(b);
    }

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (reduced) return;
      if (timer || paused) return;
      timer = window.setInterval(() => setIndex(idx + 1), AUTOPLAY_MS);
    };

    const restart = () => {
      stop();
      start();
    };

    const pause = () => {
      paused = true;
      root.classList.add("is-paused");
      stop();
    };

    const resume = () => {
      paused = false;
      root.classList.remove("is-paused");
      start();
    };

    if (prev) {
      prev.addEventListener("click", () => {
        setIndex(idx - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", () => {
        setIndex(idx + 1);
        restart();
      });
    }

    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("pointerdown", pause);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);

    setIndex(0);
    start();
  }
}

export function mountHeroTopbar() {
  if (document.body.getAttribute("data-page") !== "home") return;
  const hero = document.querySelector(".hero");
  const title = document.querySelector("[data-topbar-title]");
  const cta = document.querySelector("[data-topbar-cta]");
  if (!hero || !title) return;

  const set = (past) => {
    document.body.classList.toggle("hero-past", past);
    if (cta) cta.classList.toggle("show", past);
  };

  if (!("IntersectionObserver" in window)) {
    const onScroll = () => set(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      set(!e.isIntersecting || e.intersectionRatio < 0.35);
    },
    { threshold: [0, 0.35, 0.7] }
  );
  io.observe(hero);
}
