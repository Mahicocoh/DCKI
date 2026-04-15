import crypto from "node:crypto";
import { parseCookies, timingSafeEq } from "./http.js";

const COOKIE = "dcki_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function base64urlEncode(buf) {
  return Buffer.from(buf).toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64urlDecode(str) {
  const s = String(str || "").replaceAll("-", "+").replaceAll("_", "/");
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s + pad, "base64");
}

function hmac(secret, data) {
  return crypto.createHmac("sha256", secret).update(data).digest();
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.DCKI_ADMIN_SESSION_SECRET || "";
}

export function getAdminCredentials() {
  const user = process.env.ADMIN_USER || process.env.DCKI_ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || process.env.DCKI_ADMIN_PASS || "admin";
  return { user, pass };
}

export function isValidLogin(user, password) {
  const creds = getAdminCredentials();
  return timingSafeEq(user, creds.user) && timingSafeEq(password, creds.pass);
}

export function makeSessionCookie() {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET manquant.");
  const payload = { exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = base64urlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const sigB64 = base64urlEncode(hmac(secret, payloadB64));
  const value = `${payloadB64}.${sigB64}`;

  const secure = process.env.VERCEL ? " Secure;" : "";
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`;
}

export function clearSessionCookie() {
  const secure = process.env.VERCEL ? " Secure;" : "";
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=0`;
}

export function isAuthed(req) {
  const secret = getSecret();
  if (!secret) return false;
  const cookies = parseCookies(req);
  const raw = cookies[COOKIE] || "";
  const [payloadB64, sigB64] = raw.split(".");
  if (!payloadB64 || !sigB64) return false;
  const expectedSig = base64urlEncode(hmac(secret, payloadB64));
  if (!timingSafeEq(sigB64, expectedSig)) return false;
  let payload = null;
  try {
    payload = JSON.parse(base64urlDecode(payloadB64).toString("utf8"));
  } catch {
    return false;
  }
  if (!payload || typeof payload.exp !== "number") return false;
  return Date.now() <= payload.exp;
}

