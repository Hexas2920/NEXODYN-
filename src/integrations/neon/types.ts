export type AccessRequest = {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  role: string | null;
  delivery_interest: string | null;
  message: string | null;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  device_type: string | null;
  os_name: string | null;
  status: string;
  created_at: string;
};

export type IfuDownload = {
  id: string;
  download_type: string;
  source: string;
  destination_url: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  device_type: string | null;
  os_name: string | null;
  status: string;
  created_at: string;
};

export type PageVisit = {
  id: string;
  path: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  device_type: string | null;
  os_name: string | null;
  created_at: string;
};

export type AdminDashboard = {
  totalOrders: number;
  totalDownloads: number;
  totalVisits: number;
  ordersToday: number;
  downloadsToday: number;
  downloadsByType: { download_type: string; count: number }[];
  recentOrders: AccessRequest[];
  recentDownloads: IfuDownload[];
};
