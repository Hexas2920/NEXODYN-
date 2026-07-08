import { createFileRoute } from "@tanstack/react-router";

import { insertPageVisit } from "@/lib/tracking.server";

export const Route = createFileRoute("/api/track/visit")({
  server: {
    handlers: {
      POST: async () => {
        try {
          await insertPageVisit();
          return Response.json({ success: true });
        } catch (error) {
          console.error("track visit failed:", error);
          return Response.json(
            { success: false, error: error instanceof Error ? error.message : "Failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
