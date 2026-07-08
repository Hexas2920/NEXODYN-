import { assertAdminAuthenticated } from "@/lib/admin-auth.server";
import type { AccessRequest, AdminDashboard, IfuDownload } from "@/integrations/neon/types";

export async function fetchAdminDashboard() {
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
}

export async function fetchAccessRequests() {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  const rows = await sql`
    SELECT *
    FROM access_requests
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return rows as AccessRequest[];
}

export async function fetchIfuDownloads() {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  const rows = await sql`
    SELECT *
    FROM ifu_downloads
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return rows as IfuDownload[];
}

export async function fetchPageVisits() {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  const rows = await sql`
    SELECT *
    FROM page_visits
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return rows as import("@/integrations/neon/types").PageVisit[];
}

export async function updateOrderStatus(id: string, status: string) {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  await sql`
    UPDATE access_requests
    SET status = ${status}
    WHERE id = ${id}
  `;
}

export async function updateDownloadStatus(id: string, status: string) {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  await sql`
    UPDATE ifu_downloads
    SET status = ${status}
    WHERE id = ${id}
  `;
}

export async function deleteAccessRequest(id: string) {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  await sql`DELETE FROM access_requests WHERE id = ${id}`;
}

export async function deleteIfuDownload(id: string) {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  await sql`DELETE FROM ifu_downloads WHERE id = ${id}`;
}

export async function deletePageVisit(id: string) {
  assertAdminAuthenticated();

  const { sql } = await import("@/integrations/neon/client.server");
  await sql`DELETE FROM page_visits WHERE id = ${id}`;
}
