function normalizeIp(ip: string) {
  return ip.trim().toLowerCase().replace(/^::ffff:/, "");
}

function isPrivateIp(ip: string | null | undefined) {
  if (!ip) return true;

  const normalized = normalizeIp(ip);
  if (
    !normalized ||
    normalized === "::1" ||
    normalized === "127.0.0.1" ||
    normalized === "localhost" ||
    normalized === "0.0.0.0"
  ) {
    return true;
  }

  if (normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true;
  }

  if (
    normalized.startsWith("10.") ||
    normalized.startsWith("192.168.") ||
    normalized.startsWith("169.254.")
  ) {
    return true;
  }

  return /^172\.(1[6-9]|2\d|3[01])\./.test(normalized);
}

export function displayCountry(
  country: string | null | undefined,
  ipAddress: string | null | undefined,
) {
  if (country) return country;
  if (isPrivateIp(ipAddress)) return "Local";
  return "—";
}
