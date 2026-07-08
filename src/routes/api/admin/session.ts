import { createFileRoute } from "@tanstack/react-router";

import { isAdminAuthenticated } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({ authenticated: isAdminAuthenticated() });
      },
    },
  },
});
