import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { deletePageVisit, fetchPageVisits } from "@/lib/admin-data.server";

export const Route = createFileRoute("/api/admin/visits")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await fetchPageVisits();
          return Response.json(data);
        } catch (error) {
          console.error("admin visits failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const body = z.object({ id: z.string().uuid() }).parse(await request.json());
          await deletePageVisit(body.id);
          return Response.json({ success: true });
        } catch (error) {
          console.error("delete visit failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
    },
  },
});
