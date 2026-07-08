import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  deleteIfuDownload,
  fetchIfuDownloads,
  updateDownloadStatus,
} from "@/lib/admin-data.server";

export const Route = createFileRoute("/api/admin/downloads")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await fetchIfuDownloads();
          return Response.json(data);
        } catch (error) {
          console.error("admin downloads failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
      PATCH: async ({ request }) => {
        try {
          const body = z
            .object({
              id: z.string().uuid(),
              status: z.enum(["clicked", "completed", "failed"]),
            })
            .parse(await request.json());

          await updateDownloadStatus(body.id, body.status);
          return Response.json({ success: true });
        } catch (error) {
          console.error("update download status failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const body = z.object({ id: z.string().uuid() }).parse(await request.json());
          await deleteIfuDownload(body.id);
          return Response.json({ success: true });
        } catch (error) {
          console.error("delete download failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
    },
  },
});
