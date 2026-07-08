import { getRequestHeader } from "@tanstack/react-start/server";

import { getServerFetch } from "@/lib/server-fetch.server";

const COUNTRY_NAMES: Record<string, string> = {
  AD: "Andorra",
  AE: "United Arab Emirates",
  AF: "Afghanistan",
  AG: "Antigua and Barbuda",
  AL: "Albania",
  AM: "Armenia",
  AR: "Argentina",
  AT: "Austria",
  AU: "Australia",
  AZ: "Azerbaijan",
  BA: "Bosnia and Herzegovina",
  BD: "Bangladesh",
  BE: "Belgium",
  BG: "Bulgaria",
  BH: "Bahrain",
  BO: "Bolivia",
  BR: "Brazil",
  BY: "Belarus",
  CA: "Canada",
  CH: "Switzerland",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  DK: "Denmark",
  DO: "Dominican Republic",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egypt",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  GB: "United Kingdom",
  GE: "Georgia",
  GH: "Ghana",
  GR: "Greece",
  GT: "Guatemala",
  HK: "Hong Kong",
  HN: "Honduras",
  HR: "Croatia",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IN: "India",
  IQ: "Iraq",
  IR: "Iran",
  IS: "Iceland",
  IT: "Italy",
  JM: "Jamaica",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kyrgyzstan",
  KH: "Cambodia",
  KR: "South Korea",
  KW: "Kuwait",
  KZ: "Kazakhstan",
  LA: "Laos",
  LB: "Lebanon",
  LK: "Sri Lanka",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  MA: "Morocco",
  MD: "Moldova",
  ME: "Montenegro",
  MK: "North Macedonia",
  MM: "Myanmar",
  MN: "Mongolia",
  MO: "Macau",
  MT: "Malta",
  MX: "Mexico",
  MY: "Malaysia",
  NG: "Nigeria",
  NL: "Netherlands",
  NO: "Norway",
  NP: "Nepal",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PH: "Philippines",
  PK: "Pakistan",
  PL: "Poland",
  PR: "Puerto Rico",
  PT: "Portugal",
  PY: "Paraguay",
  QA: "Qatar",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russia",
  SA: "Saudi Arabia",
  SE: "Sweden",
  SG: "Singapore",
  SI: "Slovenia",
  SK: "Slovakia",
  TH: "Thailand",
  TJ: "Tajikistan",
  TN: "Tunisia",
  TR: "Turkey",
  TW: "Taiwan",
  UA: "Ukraine",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VE: "Venezuela",
  VN: "Vietnam",
  ZA: "South Africa",
};

function countryCodeToName(code: string | null | undefined) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  if (!normalized || normalized === "XX" || normalized === "T1") return null;
  return COUNTRY_NAMES[normalized] ?? normalized;
}

function normalizeIp(ip: string) {
  const trimmed = ip.trim().toLowerCase();
  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice("::ffff:".length);
  }
  return trimmed;
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

  if (/^172\.(1[6-9]|2\d|3[01])\./.test(normalized)) return true;

  return false;
}

async function fetchWithTimeout(url: string, timeoutMs = 3000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await getServerFetch()(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function lookupCountryViaIpApi(ip: string) {
  try {
    const response = await fetchWithTimeout(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country`,
    );
    if (!response.ok) return null;

    const data = (await response.json()) as { status?: string; country?: string };
    if (data.status === "success" && data.country) {
      return data.country;
    }
  } catch {
    // try next provider
  }

  return null;
}

async function lookupCountryViaIpApiCo(ip: string) {
  try {
    const response = await fetchWithTimeout(
      `https://ipapi.co/${encodeURIComponent(ip)}/country_name/`,
    );
    if (!response.ok) return null;

    const country = (await response.text()).trim();
    return country || null;
  } catch {
    return null;
  }
}

async function lookupCountryByIp(ip: string) {
  if (isPrivateIp(ip)) return "Local";

  const normalizedIp = normalizeIp(ip);
  return (await lookupCountryViaIpApi(normalizedIp)) ?? (await lookupCountryViaIpApiCo(normalizedIp));
}

export async function resolveClientCountry(ipAddress: string | null | undefined) {
  const cfCountry = countryCodeToName(getRequestHeader("cf-ipcountry"));
  if (cfCountry) return cfCountry;

  if (!ipAddress) return isPrivateIp(ipAddress) ? "Local" : null;

  return lookupCountryByIp(ipAddress);
}
