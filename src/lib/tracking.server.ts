import { resolveClientCountry } from "@/lib/geoip.server";
import {
  getClientIpAddress,
  getClientReferrer,
  getClientUserAgent,
  getRequestPath,
} from "@/lib/request-meta.server";
import { parseUserAgent } from "@/lib/user-agent";

export async function getClientTrackingMeta() {
  const ip_address = getClientIpAddress();
  const user_agent = getClientUserAgent();
  const { device_type, os_name } = parseUserAgent(user_agent);
  const country = await resolveClientCountry(ip_address);

  return {
    ip_address,
    user_agent,
    device_type,
    os_name,
    country,
  };
}

export async function insertPageVisit(path?: string) {
  const { sql } = await import("@/integrations/neon/client.server");
  const meta = await getClientTrackingMeta();

  await sql`
    INSERT INTO page_visits (
      path,
      ip_address,
      user_agent,
      referrer,
      country,
      device_type,
      os_name
    )
    VALUES (
      ${path ?? getRequestPath()},
      ${meta.ip_address},
      ${meta.user_agent},
      ${getClientReferrer()},
      ${meta.country},
      ${meta.device_type},
      ${meta.os_name}
    )
  `;
}

export async function insertIfuDownload(data: {
  download_type: string;
  source: string;
  destination_url: string;
}) {
  const { sql } = await import("@/integrations/neon/client.server");
  const meta = await getClientTrackingMeta();

  await sql`
    INSERT INTO ifu_downloads (
      download_type,
      source,
      destination_url,
      ip_address,
      user_agent,
      referrer,
      status,
      country,
      device_type,
      os_name
    )
    VALUES (
      ${data.download_type},
      ${data.source},
      ${data.destination_url},
      ${meta.ip_address},
      ${meta.user_agent},
      ${getClientReferrer()},
      'clicked',
      ${meta.country},
      ${meta.device_type},
      ${meta.os_name}
    )
  `;
}

export async function insertAccessRequest(data: {
  full_name: string;
  email: string;
  organization?: string | null;
  role?: string | null;
  delivery_interest?: string | null;
  message?: string | null;
}) {
  const { sql } = await import("@/integrations/neon/client.server");
  const meta = await getClientTrackingMeta();

  const rows = await sql`
    INSERT INTO access_requests (
      full_name,
      email,
      organization,
      role,
      delivery_interest,
      message,
      ip_address,
      user_agent,
      status,
      country,
      device_type,
      os_name
    )
    VALUES (
      ${data.full_name},
      ${data.email},
      ${data.organization || null},
      ${data.role || null},
      ${data.delivery_interest || null},
      ${data.message || null},
      ${meta.ip_address},
      ${meta.user_agent},
      'pending',
      ${meta.country},
      ${meta.device_type},
      ${meta.os_name}
    )
    RETURNING id
  `;

  return rows[0]?.id as string;
}
