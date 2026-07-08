const ADMIN_TOKEN_KEY = "nexodyn_admin_token";

export function getStoredAdminToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setStoredAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearStoredAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

function adminHeaders(): HeadersInit {
  const token = getStoredAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiPost<T>(url: string, body?: unknown, useAdminAuth = false): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(useAdminAuth ? adminHeaders() : {}),
    },
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data as T;
}

async function apiGet<T>(url: string, useAdminAuth = false): Promise<T> {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: useAdminAuth ? adminHeaders() : {},
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data as T;
}

async function apiDelete<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data as T;
}

async function apiPatch<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...adminHeaders(),
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data as T;
}

export const trackingApi = {
  trackVisit: () => apiPost<{ success: boolean }>("/api/track/visit"),
  trackDownload: (body: {
    download_type: "all" | "injection" | "inhalation" | "transdermal";
    source: "hero" | "delivery" | "cta";
    destination_url: string;
  }) => apiPost<{ success: boolean }>("/api/track/download", body),
  submitAccessRequest: (body: {
    full_name: string;
    email: string;
    organization?: string | null;
    role?: string | null;
    delivery_interest?: "injection" | "inhalation" | "transdermal" | "all" | null;
    message?: string | null;
  }) => apiPost<{ success: boolean; id: string }>("/api/track/access-request", body),
};

export const adminApi = {
  checkSession: () => apiGet<{ authenticated: boolean }>("/api/admin/session", true),
  login: async (password: string) => {
    const result = await apiPost<{ success: boolean; token?: string }>(
      "/api/admin/login",
      { password },
    );
    if (result.token) {
      setStoredAdminToken(result.token);
    }
    return result;
  },
  logout: async () => {
    clearStoredAdminToken();
    return apiPost<{ success: boolean }>("/api/admin/logout", undefined, true);
  },
  getDashboard: () =>
    apiGet<import("@/integrations/neon/types").AdminDashboard>("/api/admin/dashboard", true),
  getOrders: () =>
    apiGet<import("@/integrations/neon/types").AccessRequest[]>("/api/admin/orders", true),
  getDownloads: () =>
    apiGet<import("@/integrations/neon/types").IfuDownload[]>("/api/admin/downloads", true),
  getVisits: () =>
    apiGet<import("@/integrations/neon/types").PageVisit[]>("/api/admin/visits", true),
  updateOrderStatus: (id: string, status: "pending" | "contacted" | "fulfilled" | "closed") =>
    apiPatch<{ success: boolean }>("/api/admin/orders", { id, status }),
  deleteOrder: (id: string) => apiDelete<{ success: boolean }>("/api/admin/orders", { id }),
  updateDownloadStatus: (id: string, status: "clicked" | "completed" | "failed") =>
    apiPatch<{ success: boolean }>("/api/admin/downloads", { id, status }),
  deleteDownload: (id: string) =>
    apiDelete<{ success: boolean }>("/api/admin/downloads", { id }),
  deleteVisit: (id: string) => apiDelete<{ success: boolean }>("/api/admin/visits", { id }),
};
