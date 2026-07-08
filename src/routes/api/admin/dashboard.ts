import { createFileRoute } from "@tanstack/react-router";

import { fetchAdminDashboard } from "@/lib/admin-data.server";

export const Route = createFileRoute("/api/admin/dashboard")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await fetchAdminDashboard();
          return Response.json(data);
        } catch (error) {
          console.error("admin dashboard failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
    },
  },
});
