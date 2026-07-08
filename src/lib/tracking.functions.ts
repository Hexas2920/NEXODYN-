import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  getClientIpAddress,
  getClientReferrer,
  getClientUserAgent,
  getRequestPath,
} from "@/lib/request-meta.server";

const accessRequestSchema = z.object({
  full_name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  organization: z.string().trim().max(200).optional().nullable(),
  role: z.string().trim().max(120).optional().nullable(),
  delivery_interest: z
    .enum(["injection", "inhalation", "transdermal", "all"])
    .optional()
    .nullable(),
  message: z.string().trim().max(2000).optional().nullable(),
});

const downloadSchema = z.object({
  download_type: z.enum(["all", "injection", "inhalation", "transdermal"]),
  source: z.enum(["hero", "delivery", "cta"]),
  destination_url: z.string().url(),
});

const pageVisitSchema = z.object({
  path: z.string().trim().min(1).max(500),
});

export const submitAccessRequest = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof accessRequestSchema>) => accessRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { sql } = await import("@/integrations/neon/client.server");

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
        status
      )
      VALUES (
        ${data.full_name},
        ${data.email},
        ${data.organization || null},
        ${data.role || null},
        ${data.delivery_interest || null},
        ${data.message || null},
        ${getClientIpAddress()},
        ${getClientUserAgent()},
        'pending'
      )
      RETURNING id
    `;

    return { success: true as const, id: rows[0]?.id as string };
  });

export const trackIfuDownload = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof downloadSchema>) => downloadSchema.parse(data))
  .handler(async ({ data }) => {
    const { sql } = await import("@/integrations/neon/client.server");

    await sql`
      INSERT INTO ifu_downloads (
        download_type,
        source,
        destination_url,
        ip_address,
        user_agent,
        referrer,
        status
      )
      VALUES (
        ${data.download_type},
        ${data.source},
        ${data.destination_url},
        ${getClientIpAddress()},
        ${getClientUserAgent()},
        ${getClientReferrer()},
        'clicked'
      )
    `;

    return { success: true as const };
  });

export const trackPageVisit = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof pageVisitSchema>) => pageVisitSchema.parse(data))
  .handler(async ({ data }) => {
    const { sql } = await import("@/integrations/neon/client.server");

    await sql`
      INSERT INTO page_visits (path, ip_address, user_agent, referrer)
      VALUES (
        ${data.path},
        ${getClientIpAddress()},
        ${getClientUserAgent()},
        ${getClientReferrer()}
      )
    `;

    return { success: true as const };
  });

export const trackHomePageVisit = createServerFn({ method: "POST" }).handler(async () => {
  const { sql } = await import("@/integrations/neon/client.server");

  await sql`
    INSERT INTO page_visits (path, ip_address, user_agent, referrer)
    VALUES (
      ${getRequestPath()},
      ${getClientIpAddress()},
      ${getClientUserAgent()},
      ${getClientReferrer()}
    )
  `;

  return { success: true as const };
});
