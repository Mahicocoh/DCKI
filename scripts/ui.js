import { LOCALITIES, normalizeForSearch, getListingPhotos } from "./listings-data.js";
import { loadListings } from "./listings-store.js?v=202606120001";
import { getLang, t } from "./i18n.js?v=202606120001";

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

  const form = input.closest("form");
  const isSmartOn = () => {
    const toggle = form?.querySelector?.("[data-smart-toggle]");
    return toggle instanceof HTMLInputElement ? toggle.checked : false;
  };

  const render = (matches) => {
    list.innerHTML = "";
    if (!matches.length) {
      list.classList.remove("show");
      return;
    }
    for (const m of matches) {
      const div = document.createElement("div");
      div.className = "autocomplete-item";
      div.innerHTML = `<strong>${m.name}</strong> <span class="region">${m.zip} - ${m.region}</span>`;
      div.addEventListener("click", () => {
        input.value = m.name;
        list.classList.remove("show");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      list.appendChild(div);
    }
    list.classList.add("show");
  };

  const getMatches = (val) => {
    const q = normalizeForSearch(val || "");
    const base = LOCALITIES.filter((l) => {
      const name = normalizeForSearch(l.name);
      const zip = normalizeForSearch(l.zip);
      const region = normalizeForSearch(l.region);
      return !q || name.includes(q) || zip.includes(q) || region.includes(q);
    });
    return base.slice(0, 8);
  };

  const open = () => {
    if (isSmartOn()) {
      list.classList.remove("show");
      return;
    }
    render(getMatches(input.value));
  };

  input.addEventListener("input", open);
  input.addEventListener("focus", open);

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t !== input && !(t instanceof Node && list.contains(t))) {
      list.classList.remove("show");
    }
  });
}

function toIntFromText(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const cleaned = s.replace(/[^\d]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toNumberFromText(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const cleaned = s.replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function smartSearchToFilters(raw) {
  const text = String(raw ?? "").trim();
  const s = normalizeForSearch(text);
  const out = {
    cat: "",
    region: "",
    locality: "",
    propertyType: "",
    maxPrice: null,
    minRooms: null,
    minSurface: null,
    tags: [],
    nearStation: false,
    nearSchool: false,
    nearHighway: false,
  };

  if (!s) return out;

  if (/\b(acheter|achat|vente|a vendre|vendre|vend)\b/.test(s)) out.cat = "sale";
  if (/\b(louer|location|a louer|locat)\b/.test(s)) out.cat = "rent";

  if (s.includes("jura bernois")) out.region = "Jura bernois";
  else if (/\bjura\b/.test(s)) out.region = "Jura";

  if (/\b(appartement|appart|studio)\b/.test(s)) out.propertyType = "Appartement";
  if (/\b(maison)\b/.test(s)) out.propertyType = "Maison";
  if (/\b(villa)\b/.test(s)) out.propertyType = "Villa";

  const mMax =
    s.match(/(?:\bmax(?:imum)?\b|\bjusqu'?a\b|\bjusqu a\b|<=|<)\s*([0-9][0-9'’ .,]*)\s*(?:chf|fr|.-)?\b/) ||
    s.match(/\b([0-9][0-9'’ .,]*)\s*(?:chf|fr|.-)\b/);
  if (mMax) out.maxPrice = toIntFromText(mMax[1]);

  const mRooms = s.match(/(\d+(?:[.,]\d+)?)\s*(?:p|pieces|piece|rooms|room)\b/);
  if (mRooms) out.minRooms = toNumberFromText(mRooms[1]);

  const mSurf = s.match(/(\d{2,4})\s*(?:m2|m²)\b/);
  if (mSurf) out.minSurface = toIntFromText(mSurf[1]);

  out.nearStation = /\b(gare|train|station)\b/.test(s);
  out.nearSchool = /\b(ecole|school)\b/.test(s);
  out.nearHighway = /\b(autoroute|a16|highway)\b/.test(s);

  const tagRules = [
    { re: /\bcheminee\b/, v: "Cheminée" },
    { re: /\bjardin\b/, v: "Jardin" },
    { re: /\bterrasse\b/, v: "Terrasse" },
    { re: /\bbalcon\b/, v: "Balcon" },
    { re: /\bloggia\b/, v: "Loggia" },
    { re: /\bgarage\b/, v: "Garage" },
    { re: /\bascenseur\b/, v: "Ascenseur" },
    { re: /\bcalme\b/, v: "Calme" },
    { re: /\brenove\b/, v: "Rénové" },
    { re: /\bneuf\b/, v: "Neuf" },
  ];
  for (const r of tagRules) {
    if (r.re.test(s)) out.tags.push(r.v);
  }
  if (out.nearStation) out.tags.push("Proche gare");

  const byLen = [...LOCALITIES].sort((a, b) => String(b.name).length - String(a.name).length);
  for (const loc of byLen) {
    const key = normalizeForSearch(loc?.name || "");
    if (key && s.includes(key)) {
      out.locality = loc.name;
      break;
    }
  }

  out.tags = [...new Set(out.tags)];
  return out;
}

export function mountSmartSearch() {
  const smartToggles = Array.from(document.querySelectorAll("[data-smart-toggle]"));
  for (const toggle of smartToggles) {
    if (!(toggle instanceof HTMLInputElement)) continue;
    const form = toggle.closest("form");
    if (!(form instanceof HTMLFormElement)) continue;
    const q = form.querySelector("input[name='q']");
    if (!(q instanceof HTMLInputElement)) continue;
    const help = form.querySelector("[data-smart-help]");

    const defaultPh = q.getAttribute("placeholder") || "";
    const smartPh = "Que cherches-tu ?";
    q.setAttribute("data-smart-default-ph", defaultPh);
    q.setAttribute("data-smart-ph", smartPh);

    const apply = () => {
      const enabled = toggle.checked;
      q.placeholder = enabled ? smartPh : (q.getAttribute("data-smart-default-ph") || defaultPh);
      const list = form.querySelector(".autocomplete-list");
      if (list instanceof HTMLElement) list.classList.remove("show");
      if (help instanceof HTMLElement) {
        help.classList.toggle("is-on", enabled);
        help.setAttribute("aria-hidden", enabled ? "false" : "true");
      }
    };
    toggle.addEventListener("change", apply);
    apply();
  }

  const form = document.querySelector("form[data-home-search]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const smartToggle = form.querySelector("[data-smart-toggle]");
    if (!(smartToggle instanceof HTMLInputElement) || !smartToggle.checked) return;

    const q = form.querySelector("input[name='q']");
    if (!(q instanceof HTMLInputElement)) return;
    const raw = q.value.trim();
    if (!raw) return;

    const f = smartSearchToFilters(raw);
    const hasSignal =
      Boolean(f.cat || f.region || f.locality || f.propertyType) ||
      f.maxPrice != null ||
      f.minRooms != null ||
      f.minSurface != null ||
      f.nearStation ||
      f.nearSchool ||
      f.nearHighway ||
      (Array.isArray(f.tags) && f.tags.length);
    if (!hasSignal) return;

    e.preventDefault();

    const p = new URLSearchParams(new FormData(form));
    p.delete("q");

    if (f.cat) p.set("cat", f.cat);
    if (f.region) p.set("region", f.region);
    if (f.locality) p.set("locality", f.locality);
    if (f.propertyType) p.set("type", f.propertyType);
    if (f.maxPrice != null) p.set("maxPrice", String(f.maxPrice));
    if (f.minRooms != null) p.set("minRooms", String(f.minRooms));
    if (f.minSurface != null) p.set("minSurface", String(f.minSurface));

    const pickedTags = Array.from(form.querySelectorAll("input[name='tags']:checked")).map((i) => i.value);
    const tags = [...new Set([...(pickedTags || []), ...(f.tags || [])])].filter(Boolean);
    p.delete("tags");
    if (tags.length) p.set("tags", tags.join(","));

    p.delete("nearStation");
    p.delete("nearSchool");
    p.delete("nearHighway");
    if (f.nearStation) p.set("nearStation", "1");
    if (f.nearSchool) p.set("nearSchool", "1");
    if (f.nearHighway) p.set("nearHighway", "1");

    const url = `${form.getAttribute("action") || "./biens.html"}?${p.toString()}`;
    window.location.href = url;
  });
}

export function mountHomeSearchRanges() {
  const form = document.querySelector("form[data-home-search]");
  if (!form) return;

  if (document.getElementById("home-q") && document.getElementById("home-autocomplete")) {
    initAutocomplete("home-q", "home-autocomplete");
  }

  const minPriceSel = form.querySelector("select[name='minPrice']");
  const maxPriceSel = form.querySelector("select[name='maxPrice']");
  const maxRoomsSel = form.querySelector("select[name='maxRooms']");
  const minSurfaceSel = form.querySelector("select[name='minSurface']");
  const maxSurfaceSel = form.querySelector("select[name='maxSurface']");

  const formatCHF = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  const fmtRooms = (v) => String(v).replace(".", ",");
  const range = (from, to, step) => {
    const out = [];
    for (let v = from; v <= to; v += step) out.push(v);
    return out;
  };
  const getPriceValues = (mode) => {
    if (mode === "rent") return range(500, 5000, 250);
    if (mode === "sale") {
      const a = range(50000, 500000, 50000);
      const b = range(600000, 1000000, 100000);
      const c = range(1250000, 3000000, 250000);
      return [...a, ...b, ...c];
    }
    const all = [...range(500, 5000, 250), ...range(50000, 500000, 50000), ...range(600000, 1000000, 100000), ...range(1250000, 3000000, 250000)];
    return [...new Set(all)].sort((x, y) => x - y);
  };
  const getRoomsValues = () => {
    const out = [];
    for (let v = 1; v <= 8.001; v += 0.5) out.push(Number(v.toFixed(1)));
    return out;
  };
  const getSurfaceValues = () => range(25, 300, 25);

  const fillSelect = (el, values, labeler) => {
    if (!(el instanceof HTMLSelectElement)) return;
    const keep = el.value;
    el.innerHTML = [`<option value="">indiff.</option>`].concat(values.map((v) => `<option value="${v}">${labeler(v)}</option>`)).join("");
    if (keep) el.value = keep;
  };

  const toNumber = (v) => {
    const n = Number(String(v ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };
  const toInt = (v) => {
    const s = String(v ?? "").trim();
    if (!s) return null;
    const cleaned = s.replace(/[^\d]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };
  const ensureMinMax = (minEl, maxEl, coerce) => {
    if (!(minEl instanceof HTMLSelectElement) || !(maxEl instanceof HTMLSelectElement)) return;
    const a = coerce(minEl.value);
    const b = coerce(maxEl.value);
    if (a == null || b == null) return;
    if (a <= b) return;
    maxEl.value = minEl.value;
  };

  if (minPriceSel instanceof HTMLSelectElement && maxPriceSel instanceof HTMLSelectElement) {
    minPriceSel.addEventListener("change", () => ensureMinMax(minPriceSel, maxPriceSel, toInt));
    maxPriceSel.addEventListener("change", () => ensureMinMax(minPriceSel, maxPriceSel, toInt));
  }
  if (minSurfaceSel instanceof HTMLSelectElement && maxSurfaceSel instanceof HTMLSelectElement) {
    minSurfaceSel.addEventListener("change", () => ensureMinMax(minSurfaceSel, maxSurfaceSel, toInt));
    maxSurfaceSel.addEventListener("change", () => ensureMinMax(minSurfaceSel, maxSurfaceSel, toInt));
  }
  const minRoomsSel = form.querySelector("select[name='minRooms']");
  if (minRoomsSel instanceof HTMLSelectElement && maxRoomsSel instanceof HTMLSelectElement) {
    minRoomsSel.addEventListener("change", () => ensureMinMax(minRoomsSel, maxRoomsSel, toNumber));
    maxRoomsSel.addEventListener("change", () => ensureMinMax(minRoomsSel, maxRoomsSel, toNumber));
  }

  const update = () => {
    const mode = (form.querySelector("input[name='cat']:checked")?.value || "").trim();
    fillSelect(minPriceSel, getPriceValues(mode), (v) => `${formatCHF(v)} CHF`);
    fillSelect(maxPriceSel, getPriceValues(mode), (v) => `${formatCHF(v)} CHF`);
    fillSelect(maxRoomsSel, getRoomsValues(), (v) => fmtRooms(v));
    fillSelect(minSurfaceSel, getSurfaceValues(), (v) => `${v} m²`);
    fillSelect(maxSurfaceSel, getSurfaceValues(), (v) => `${v} m²`);
    ensureMinMax(minPriceSel, maxPriceSel, toInt);
    ensureMinMax(minSurfaceSel, maxSurfaceSel, toInt);
    ensureMinMax(minRoomsSel, maxRoomsSel, toNumber);
  };

  for (const r of form.querySelectorAll("input[name='cat']")) {
    r.addEventListener("change", update);
  }
  update();
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

export function mountCantonBubbles() {
  const hosts = Array.from(document.querySelectorAll(".advice-map-right")).filter((el) => el.querySelector(".advice-map-bubble"));
  if (!hosts.length) return;

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const setBubbleAria = (host, on) => {
    const bubble = host.querySelector(".advice-map-bubble");
    if (!(bubble instanceof HTMLElement)) return;
    bubble.setAttribute("aria-hidden", on ? "false" : "true");
  };

  const closeAll = () => {
    for (const el of hosts) {
      if (!(el instanceof HTMLElement)) continue;
      el.classList.remove("is-bubble-on");
      setBubbleAria(el, false);
    }
  };

  if (isMobile) {
    for (const host of hosts) {
      if (!(host instanceof HTMLElement)) continue;
      host.addEventListener("click", (e) => {
        const insideBubble = e.target instanceof HTMLElement && Boolean(e.target.closest(".advice-map-bubble"));
        if (insideBubble) return;
        const next = !host.classList.contains("is-bubble-on");
        closeAll();
        host.classList.toggle("is-bubble-on", next);
        setBubbleAria(host, next);
      });
    }

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.closest(".advice-map-right")) return;
      closeAll();
    });
    return;
  }

  if (reduced || typeof IntersectionObserver === "undefined") return;

  const seen = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const host = entry.target;
        if (!(host instanceof HTMLElement)) continue;
        if (!entry.isIntersecting) continue;
        if (seen.has(host)) continue;
        seen.add(host);

        host.classList.add("is-bubble-peek");
        setBubbleAria(host, true);
        window.setTimeout(() => {
          host.classList.remove("is-bubble-peek");
          setBubbleAria(host, false);
        }, 1800);

        io.unobserve(host);
      }
    },
    { threshold: 0.6 }
  );

  for (const host of hosts) {
    if (!(host instanceof HTMLElement)) continue;
    io.observe(host);
  }
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

const FAVORITES_STORAGE_KEY = "dcki_favorites_v1";
let favoritesCache = null;

function loadFavoritesSet() {
  if (favoritesCache) return favoritesCache;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    favoritesCache = new Set(Array.isArray(arr) ? arr.map((v) => String(v)) : []);
  } catch {
    favoritesCache = new Set();
  }
  return favoritesCache;
}

function saveFavoritesSet(set) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function isFavorite(listingId) {
  const id = String(listingId || "").trim();
  if (!id) return false;
  return loadFavoritesSet().has(id);
}

export function toggleFavorite(listingId) {
  const id = String(listingId || "").trim();
  if (!id) return false;
  const set = loadFavoritesSet();
  const next = !set.has(id);
  if (next) set.add(id);
  else set.delete(id);
  saveFavoritesSet(set);
  return next;
}

function favoriteIconSvg() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
  `;
}

function ensureFavButton(button) {
  if (!(button instanceof HTMLElement)) return;
  if (button.dataset.favBound === "1") return;
  button.dataset.favBound = "1";
  if (!(button instanceof HTMLButtonElement)) {
    if (!button.hasAttribute("role")) button.setAttribute("role", "button");
    if (!button.hasAttribute("tabindex")) button.setAttribute("tabindex", "0");
  }
  if (!button.innerHTML.trim()) button.innerHTML = favoriteIconSvg();
}

function updateFavButton(button, fav) {
  if (!(button instanceof HTMLElement)) return;
  ensureFavButton(button);
  button.setAttribute("aria-pressed", fav ? "true" : "false");
  button.setAttribute("aria-label", fav ? "Retirer des favoris" : "Ajouter aux favoris");
  button.classList.toggle("is-on", fav);
}

function getFavIdFromButton(button) {
  const raw = button.getAttribute("data-fav-id") || "";
  if (raw) return raw;
  const card = button.closest(".card.listing");
  if (card instanceof HTMLElement) return getCardListingId(card);
  return "";
}

function syncFavoritesUI(root = document) {
  const scope = root && typeof root.querySelectorAll === "function" ? root : document;
  const set = loadFavoritesSet();
  for (const card of Array.from(scope.querySelectorAll(".card.listing"))) {
    const id = getCardListingId(card);
    if (!id) continue;
    card.classList.toggle("is-fav", set.has(id));
  }
  for (const btn of Array.from(scope.querySelectorAll("[data-fav-btn]"))) {
    if (!(btn instanceof HTMLElement)) continue;
    const id = getFavIdFromButton(btn);
    if (!id) continue;
    updateFavButton(btn, set.has(id));
  }
}

export function mountFavorites() {
  for (const card of Array.from(document.querySelectorAll(".card.listing"))) {
    const media = card.querySelector(".media");
    if (!(media instanceof HTMLElement)) continue;
    let btn = media.querySelector("[data-fav-btn]");
    if (!(btn instanceof HTMLElement)) {
      btn = document.createElement("span");
      btn.className = "fav-btn";
      btn.setAttribute("role", "button");
      btn.setAttribute("tabindex", "0");
      btn.setAttribute("data-fav-btn", "");
      media.appendChild(btn);
    }
    ensureFavButton(btn);
    const id = getCardListingId(card);
    if (id) btn.setAttribute("data-fav-id", id);
  }

  for (const btn of Array.from(document.querySelectorAll("[data-fav-btn]"))) {
    ensureFavButton(btn);
  }

  if (document.body.dataset.favDelegationBound !== "1") {
    document.body.dataset.favDelegationBound = "1";
    document.addEventListener("click", (e) => {
      const t = e.target;
      const btn = t instanceof Element ? t.closest("[data-fav-btn]") : null;
      if (!(btn instanceof HTMLElement)) return;
      e.preventDefault();
      e.stopPropagation();
      const id = getFavIdFromButton(btn);
      if (!id) return;
      const fav = toggleFavorite(id);
      syncFavoritesUI(document);
      updateFavButton(btn, fav);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const t = e.target;
      const btn = t instanceof Element ? t.closest("[data-fav-btn]") : null;
      if (!(btn instanceof HTMLElement)) return;
      e.preventDefault();
      e.stopPropagation();
      const id = getFavIdFromButton(btn);
      if (!id) return;
      const fav = toggleFavorite(id);
      syncFavoritesUI(document);
      updateFavButton(btn, fav);
    });
  }

  syncFavoritesUI(document);
}

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
