import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  assertAdminAuthenticated,
  clearAdminSessionCookie,
  isAdminAuthenticated,
  setAdminSessionCookie,
} from "@/lib/admin-auth.server";
import type { AccessRequest, AdminDashboard, IfuDownload } from "@/integrations/neon/types";

const loginSchema = z.object({
  password: z.string().min(1),
});

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  return { authenticated: isAdminAuthenticated() };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof loginSchema>) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD is not configured on the server.");
    }

    if (data.password !== adminPassword) {
      throw new Error("Invalid password");
    }

    setAdminSessionCookie();
    return { success: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  clearAdminSessionCookie();
  return { success: true as const };
});

export const getAdminDashboard = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");

  const [ordersCount] = await sql`SELECT COUNT(*)::int AS count FROM access_requests`;
  const [downloadsCount] = await sql`SELECT COUNT(*)::int AS count FROM ifu_downloads`;
  const [visitsCount] = await sql`SELECT COUNT(*)::int AS count FROM page_visits`;
  const [ordersToday] = await sql`
    SELECT COUNT(*)::int AS count
    FROM access_requests
    WHERE created_at >= date_trunc('day', now())
  `;
  const [downloadsToday] = await sql`
    SELECT COUNT(*)::int AS count
    FROM ifu_downloads
    WHERE created_at >= date_trunc('day', now())
  `;
  const downloadsByType = await sql`
    SELECT download_type, COUNT(*)::int AS count
    FROM ifu_downloads
    GROUP BY download_type
    ORDER BY count DESC
  `;
  const recentOrders = await sql`
    SELECT *
    FROM access_requests
    ORDER BY created_at DESC
    LIMIT 10
  `;
  const recentDownloads = await sql`
    SELECT *
    FROM ifu_downloads
    ORDER BY created_at DESC
    LIMIT 10
  `;

  return {
    totalOrders: ordersCount.count as number,
    totalDownloads: downloadsCount.count as number,
    totalVisits: visitsCount.count as number,
    ordersToday: ordersToday.count as number,
    downloadsToday: downloadsToday.count as number,
    downloadsByType: downloadsByType as AdminDashboard["downloadsByType"],
    recentOrders: recentOrders as AccessRequest[],
    recentDownloads: recentDownloads as IfuDownload[],
  } satisfies AdminDashboard;
});

export const getAccessRequests = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  const rows = await sql`
    SELECT *
    FROM access_requests
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return rows as AccessRequest[];
});

export const getIfuDownloads = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  const rows = await sql`
    SELECT *
    FROM ifu_downloads
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return rows as IfuDownload[];
});

export const updateAccessRequestStatus = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: "pending" | "contacted" | "fulfilled" | "closed" }) => data)
  .handler(async ({ data }) => {
    assertAdminAuthenticated();

    const { sql } = await import("@/integrations/neon/client.server");

    await sql`
      UPDATE access_requests
      SET status = ${data.status}
      WHERE id = ${data.id}
    `;

    return { success: true as const };
  });
