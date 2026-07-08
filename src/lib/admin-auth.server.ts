import { createHmac, timingSafeEqual } from "node:crypto";

import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";

export const COOKIE_NAME = "nexodyn_admin";
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function getAdminSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "change-me";
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getAdminSecret()).update(payload).digest("hex");
}

export function createAdminSessionToken() {
  const issuedAt = Date.now().toString();
  const signature = signSessionPayload(issuedAt);
  return `${issuedAt}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return false;
  if (Date.now() - issuedAtMs > SESSION_MAX_AGE_MS) return false;

  const expected = signSessionPayload(issuedAt);
  const actual = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);

  if (actual.length !== expectedBuf.length) return false;
  return timingSafeEqual(actual, expectedBuf);
}

export function buildAdminSessionCookie(token: string) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_MS / 1000}`;
}

export function buildClearAdminSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function getAdminSessionFromCookie() {
  const cookieHeader = getRequestHeader("cookie");
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const match = cookies.find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return undefined;

  return decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
}

function getAdminSessionFromAuthorization() {
  const authHeader = getRequestHeader("authorization");
  if (!authHeader?.startsWith("Bearer ")) return undefined;
  return authHeader.slice("Bearer ".length).trim();
}

export function getAdminSessionToken() {
  return getAdminSessionFromAuthorization() ?? getAdminSessionFromCookie();
}

export function isAdminAuthenticated() {
  return verifyAdminSessionToken(getAdminSessionToken());
}

export function setAdminSessionCookie() {
  const token = createAdminSessionToken();
  setResponseHeader("Set-Cookie", buildAdminSessionCookie(token));
  return token;
}

export function clearAdminSessionCookie() {
  setResponseHeader("Set-Cookie", buildClearAdminSessionCookie());
}

export function assertAdminAuthenticated() {
  if (!isAdminAuthenticated()) {
    throw new Error("Unauthorized");
  }
}

export function jsonWithAdminCookie(body: unknown, token: string) {
  return Response.json(body, {
    headers: {
      "Set-Cookie": buildAdminSessionCookie(token),
    },
  });
}

export function jsonWithClearAdminCookie(body: unknown) {
  return Response.json(body, {
    headers: {
      "Set-Cookie": buildClearAdminSessionCookie(),
    },
  });
}
