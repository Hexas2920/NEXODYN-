import { Download } from "lucide-react";

import { trackingApi } from "@/lib/api-client";

type DownloadType = "all" | "injection" | "inhalation" | "transdermal";
type DownloadSource = "hero" | "delivery" | "cta";

type TrackedDownloadLinkProps = {
  href: string;
  downloadType: DownloadType;
  source: DownloadSource;
  className?: string;
  children: React.ReactNode;
};

export function TrackedDownloadLink({
  href,
  downloadType,
  source,
  className,
  children,
}: TrackedDownloadLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        void trackingApi
          .trackDownload({
            download_type: downloadType,
            source,
            destination_url: href,
          })
          .catch((error) => {
            console.error("Failed to track download:", error);
          });
      }}
    >
      {children}
    </a>
  );
}

export function TrackedDownloadButton({
  href,
  downloadType,
  source,
  className,
  label,
}: {
  href: string;
  downloadType: DownloadType;
  source: DownloadSource;
  className?: string;
  label: string;
}) {
  return (
    <TrackedDownloadLink
      href={href}
      downloadType={downloadType}
      source={source}
      className={className}
    >
      <Download className="h-4 w-4" /> {label}
    </TrackedDownloadLink>
  );
}
