import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  createAdminSessionToken,
  jsonWithAdminCookie,
} from "@/lib/admin-auth.server";

const bodySchema = z.object({
  password: z.string().min(1),
});

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { password } = bodySchema.parse(await request.json());
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (!adminPassword) {
            return Response.json({ success: false, error: "ADMIN_PASSWORD not configured" }, { status: 500 });
          }

          if (password !== adminPassword) {
            return Response.json({ success: false, error: "Invalid password" }, { status: 401 });
          }

          const token = createAdminSessionToken();
          return jsonWithAdminCookie({ success: true, token }, token);
        } catch (error) {
          console.error("admin login failed:", error);
          return Response.json(
            { success: false, error: error instanceof Error ? error.message : "Failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
