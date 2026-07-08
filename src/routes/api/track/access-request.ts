import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { insertAccessRequest } from "@/lib/tracking.server";

const bodySchema = z.object({
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

export const Route = createFileRoute("/api/track/access-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = bodySchema.parse(await request.json());
          const id = await insertAccessRequest(body);
          return Response.json({ success: true, id });
        } catch (error) {
          console.error("access request failed:", error);
          return Response.json(
            { success: false, error: error instanceof Error ? error.message : "Failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
