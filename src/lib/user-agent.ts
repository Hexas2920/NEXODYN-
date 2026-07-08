export type ParsedUserAgent = {
  device_type: string | null;
  os_name: string | null;
};

export function parseUserAgent(userAgent: string | null | undefined): ParsedUserAgent {
  if (!userAgent) {
    return { device_type: null, os_name: null };
  }

  let device_type = "desktop";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(userAgent)) {
    device_type = "mobile";
  } else if (/ipad|tablet|android(?!.*mobile)/i.test(userAgent)) {
    device_type = "tablet";
  }

  let os_name = "Unknown";
  if (/windows nt/i.test(userAgent)) os_name = "Windows";
  else if (/mac os x/i.test(userAgent) && !/iphone|ipad|ipod/i.test(userAgent)) os_name = "macOS";
  else if (/iphone|ipad|ipod/i.test(userAgent)) os_name = "iOS";
  else if (/android/i.test(userAgent)) os_name = "Android";
  else if (/cros/i.test(userAgent)) os_name = "Chrome OS";
  else if (/linux/i.test(userAgent)) os_name = "Linux";

  return { device_type, os_name };
}

export function displayDeviceType(
  stored: string | null | undefined,
  userAgent: string | null | undefined,
) {
  return stored ?? parseUserAgent(userAgent).device_type ?? "—";
}

export function displayOsName(stored: string | null | undefined, userAgent: string | null | undefined) {
  return stored ?? parseUserAgent(userAgent).os_name ?? "—";
}
