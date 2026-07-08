import { createFileRoute } from "@tanstack/react-router";

import { jsonWithClearAdminCookie } from "@/lib/admin-auth.server";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () => {
        return jsonWithClearAdminCookie({ success: true });
      },
    },
  },
});
