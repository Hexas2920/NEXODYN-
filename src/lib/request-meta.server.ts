import { getRequest, getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

export function getClientIpAddress() {
  return (
    getRequestIP({ xForwardedFor: true }) ??
    getRequestHeader("cf-connecting-ip") ??
    getRequestHeader("x-real-ip") ??
    null
  );
}

export function getClientUserAgent() {
  return getRequestHeader("user-agent") ?? null;
}

export function getClientReferrer() {
  return getRequestHeader("referer") ?? null;
}

export function getRequestPath() {
  try {
    return new URL(getRequest().url).pathname;
  } catch {
    return "/";
  }
}
