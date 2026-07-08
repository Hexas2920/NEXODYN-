import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { insertIfuDownload } from "@/lib/tracking.server";

const bodySchema = z.object({
  download_type: z.enum(["all", "injection", "inhalation", "transdermal"]),
  source: z.enum(["hero", "delivery", "cta"]),
  destination_url: z.string().url(),
});

export const Route = createFileRoute("/api/track/download")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = bodySchema.parse(await request.json());
          await insertIfuDownload(body);
          return Response.json({ success: true });
        } catch (error) {
          console.error("track download failed:", error);
          return Response.json(
            { success: false, error: error instanceof Error ? error.message : "Failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
