import { useEffect } from "react";

import { trackingApi } from "@/lib/api-client";

export function PageVisitTracker() {
  useEffect(() => {
    void trackingApi.trackVisit().catch((error) => {
      console.error("Failed to track page visit:", error);
    });
  }, []);

  return null;
}
