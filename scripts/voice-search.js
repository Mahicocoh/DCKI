import { getLang, t } from "./i18n.js?v=202605301300";
import { showToast } from "./ui.js?v=202605301300";

function getRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (typeof SR !== "function") return null;
  return SR;
}

async function ensureMicPermission() {
  const md = navigator.mediaDevices;
  if (!md?.getUserMedia) return true;
  try {
    const stream = await md.getUserMedia({ audio: true });
    for (const track of stream.getTracks()) track.stop();
    return true;
  } catch {
    return false;
  }
}

function getRecognitionLang() {
  const lang = getLang();
  if (lang === "en") return "en-US";
  return "fr-FR";
}

export function initVoiceSearch() {
  const SR = getRecognition();
  const btns = Array.from(document.querySelectorAll("[data-voice-btn]"));
  if (!btns.length) return;

  for (const btn of btns) {
    if (!(btn instanceof HTMLButtonElement)) continue;
    const sel = (btn.getAttribute("data-voice-input") || "").trim();
    const input = sel ? document.querySelector(sel) : null;
    if (!(input instanceof HTMLInputElement)) {
      btn.remove();
      continue;
    }

    const wrap = btn.closest(".autocomplete-wrapper");
    if (wrap instanceof HTMLElement) wrap.classList.add("has-voice");

    if (!SR) {
      btn.remove();
      if (wrap instanceof HTMLElement) wrap.classList.remove("has-voice");
      continue;
    }

    let rec = null;
    let listening = false;

    const startLabel = () => (btn.getAttribute("data-voice-start") || btn.getAttribute("aria-label") || "").trim();
    const stopLabel = () => (btn.getAttribute("data-voice-stop") || "").trim() || startLabel();

    const stop = () => {
      if (rec) {
        try {
          rec.stop();
        } catch {}
      }
      listening = false;
      btn.classList.remove("is-listening");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", startLabel());
      btn.setAttribute("title", startLabel());
    };

    const start = async () => {
      if (listening) return;
      const permOk = await ensureMicPermission();
      if (!permOk) {
        showToast(t("toast.voice.permission"));
        return;
      }

      rec = new SR();
      rec.lang = getRecognitionLang();
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        listening = true;
        btn.classList.add("is-listening");
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", stopLabel());
        btn.setAttribute("title", stopLabel());
      };

      rec.onresult = (e) => {
        const first = e.results?.[0]?.[0];
        const text = String(first?.transcript || "").trim();
        if (!text) return;
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.focus();
      };

      rec.onerror = (e) => {
        const code = String(e?.error || "");
        if (code === "not-allowed" || code === "service-not-allowed") showToast(t("toast.voice.permission"));
        else if (code === "no-speech") showToast(t("toast.voice.noSpeech"));
        else if (code === "network") showToast(t("toast.voice.network"));
        else showToast(t("toast.voice.unavailable"));
        stop();
      };
      rec.onend = () => stop();

      try {
        rec.start();
      } catch {
        showToast(t("toast.voice.unavailable"));
        stop();
      }
    };

    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", startLabel());
    btn.setAttribute("title", startLabel());
    btn.addEventListener("click", () => {
      if (listening) stop();
      else void start();
    });

    document.addEventListener("dcki:lang", () => {
      if (!listening) return;
      try {
        rec.lang = getRecognitionLang();
      } catch {}
    });
  }
}
