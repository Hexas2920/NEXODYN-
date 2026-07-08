import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  deleteAccessRequest,
  fetchAccessRequests,
  updateOrderStatus,
} from "@/lib/admin-data.server";

export const Route = createFileRoute("/api/admin/orders")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await fetchAccessRequests();
          return Response.json(data);
        } catch (error) {
          console.error("admin orders failed:", error);
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
              status: z.enum(["pending", "contacted", "fulfilled", "closed"]),
            })
            .parse(await request.json());

          await updateOrderStatus(body.id, body.status);
          return Response.json({ success: true });
        } catch (error) {
          console.error("update order status failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const body = z.object({ id: z.string().uuid() }).parse(await request.json());
          await deleteAccessRequest(body.id);
          return Response.json({ success: true });
        } catch (error) {
          console.error("delete order failed:", error);
          return Response.json(
            { error: error instanceof Error ? error.message : "Failed" },
            { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500 },
          );
        }
      },
    },
  },
});
