import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Activity,
  Download,
  Loader2,
  LogOut,
  MessageSquare,
  RefreshCw,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AccessRequest, AdminDashboard, IfuDownload, PageVisit } from "@/integrations/neon/types";
import { adminApi } from "@/lib/api-client";
import { displayCountry } from "@/lib/tracking-display";
import { displayDeviceType, displayOsName } from "@/lib/user-agent";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "MMM d, yyyy HH:mm");
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-red-300 hover:bg-red-500/10 hover:text-red-200"
      onClick={() => {
        if (window.confirm("Delete this record permanently?")) {
          onDelete();
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [orders, setOrders] = useState<AccessRequest[]>([]);
  const [downloads, setDownloads] = useState<IfuDownload[]>([]);
  const [visits, setVisits] = useState<PageVisit[]>([]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [dashboardData, ordersData, downloadsData, visitsData] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getOrders(),
        adminApi.getDownloads(),
        adminApi.getVisits(),
      ]);
      setDashboard(dashboardData);
      setOrders(ordersData);
      setDownloads(downloadsData);
      setVisits(visitsData);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void adminApi
      .checkSession()
      .then((result) => {
        setAuthenticated(result.authenticated);
        if (result.authenticated) {
          void refreshData();
        }
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.login(password);
      setAuthenticated(true);
      setPassword("");
      toast.success("Welcome back");
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Invalid password or server not configured");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await adminApi.logout();
    setAuthenticated(false);
    setDashboard(null);
    setOrders([]);
    setDownloads([]);
    setVisits([]);
  };

  const onStatusChange = async (id: string, status: AccessRequest["status"]) => {
    try {
      await adminApi.updateOrderStatus(id, status as "pending" | "contacted" | "fulfilled" | "closed");
      setOrders((current) =>
        current.map((order) => (order.id === id ? { ...order, status } : order)),
      );
      toast.success("Order status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const onDownloadStatusChange = async (id: string, status: IfuDownload["status"]) => {
    try {
      await adminApi.updateDownloadStatus(id, status as "clicked" | "completed" | "failed");
      setDownloads((current) =>
        current.map((download) => (download.id === id ? { ...download, status } : download)),
      );
      toast.success("Download status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update download status");
    }
  };

  const onDeleteOrder = async (id: string) => {
    try {
      await adminApi.deleteOrder(id);
      setOrders((current) => current.filter((order) => order.id !== id));
      toast.success("Order deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    }
  };

  const onDeleteDownload = async (id: string) => {
    try {
      await adminApi.deleteDownload(id);
      setDownloads((current) => current.filter((download) => download.id !== id));
      toast.success("Download deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete download");
    }
  };

  const onDeleteVisit = async (id: string) => {
    try {
      await adminApi.deleteVisit(id);
      setVisits((current) => current.filter((visit) => visit.id !== id));
      toast.success("Visit deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete visit");
    }
  };

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-sky-300" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <Card className="w-full max-w-md border-white/10 bg-slate-900 text-white">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20">
              <Shield className="h-6 w-6 text-sky-300" />
            </div>
            <CardTitle>NEXODYN Admin</CardTitle>
            <CardDescription className="text-sky-200/70">
              Sign in to track customer orders, IFU downloads, and visitor activity from Neon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-sky-200/40"
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">NEXODYN Admin</h1>
            <p className="text-sm text-sky-200/70">Customer tracking powered by Neon PostgreSQL</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void refreshData()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => void onLogout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={dashboard?.totalOrders ?? 0}
            subtitle={`${dashboard?.ordersToday ?? 0} today`}
            icon={MessageSquare}
          />
          <StatCard
            title="IFU Downloads"
            value={dashboard?.totalDownloads ?? 0}
            subtitle={`${dashboard?.downloadsToday ?? 0} today`}
            icon={Download}
          />
          <StatCard
            title="Page Visits"
            value={dashboard?.totalVisits ?? 0}
            subtitle="Homepage sessions tracked"
            icon={Activity}
          />
          <StatCard
            title="Unique IPs"
            value={new Set(downloads.map((d) => d.ip_address).filter(Boolean)).size}
            subtitle="From download events"
            icon={Users}
          />
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="bg-slate-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders / Messages</TabsTrigger>
            <TabsTrigger value="downloads">IFU Downloads</TabsTrigger>
            <TabsTrigger value="visits">Page Visits</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/10 bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle>Downloads by Format</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(dashboard?.downloadsByType ?? []).map((item) => (
                    <div key={item.download_type} className="flex items-center justify-between">
                      <span className="capitalize text-sky-100">{item.download_type}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                  {!dashboard?.downloadsByType.length && (
                    <p className="text-sm text-sky-200/60">No downloads recorded yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-slate-900 text-white">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription className="text-sky-200/70">
                    Latest orders and download clicks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {(dashboard?.recentOrders ?? []).slice(0, 5).map((order) => (
                    <div key={order.id} className="border-b border-white/5 pb-3">
                      <div className="font-medium">{order.full_name}</div>
                      <div className="text-sky-200/70">
                        {order.email} · {displayCountry(order.country, order.ip_address)} ·{" "}
                        {displayDeviceType(order.device_type, order.user_agent)} /{" "}
                        {displayOsName(order.os_name, order.user_agent)}
                      </div>
                    </div>
                  ))}
                  {(dashboard?.recentDownloads ?? []).slice(0, 5).map((download) => (
                    <div key={download.id} className="border-b border-white/5 pb-3">
                      <div className="font-medium capitalize">{download.download_type} IFU</div>
                      <div className="text-sky-200/70">
                        {download.source} · {displayCountry(download.country, download.ip_address)} ·{" "}
                        {download.status} · {displayDeviceType(download.device_type, download.user_agent)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card className="border-white/10 bg-slate-900 text-white">
              <CardHeader>
                <CardTitle>Access Requests & Order Messages</CardTitle>
                <CardDescription className="text-sky-200/70">
                  Customer form submissions with IP address and delivery interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-white/10">
                        <TableCell className="whitespace-nowrap text-sky-200/80">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell>{order.full_name}</TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell className="capitalize">{order.delivery_interest || "—"}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.message || "—"}</TableCell>
                        <TableCell className="font-mono text-xs">{order.ip_address || "—"}</TableCell>
                        <TableCell>{displayCountry(order.country, order.ip_address)}</TableCell>
                        <TableCell className="capitalize">
                          {displayDeviceType(order.device_type, order.user_agent)}
                        </TableCell>
                        <TableCell>{displayOsName(order.os_name, order.user_agent)}</TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={(e) => void onStatusChange(order.id, e.target.value)}
                            className="rounded-md border border-white/10 bg-slate-800 px-2 py-1 text-xs"
                          >
                            <option value="pending">pending</option>
                            <option value="contacted">contacted</option>
                            <option value="fulfilled">fulfilled</option>
                            <option value="closed">closed</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <DeleteButton onDelete={() => void onDeleteOrder(order.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!orders.length && (
                  <p className="py-8 text-center text-sm text-sky-200/60">No orders yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <Card className="border-white/10 bg-slate-900 text-white">
              <CardHeader>
                <CardTitle>IFU Download Tracking</CardTitle>
                <CardDescription className="text-sky-200/70">
                  Every IFU button click with IP, source, and destination URL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloads.map((download) => (
                      <TableRow key={download.id} className="border-white/10">
                        <TableCell className="whitespace-nowrap text-sky-200/80">
                          {formatDate(download.created_at)}
                        </TableCell>
                        <TableCell className="capitalize">{download.download_type}</TableCell>
                        <TableCell className="capitalize">{download.source}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {download.ip_address || "—"}
                        </TableCell>
                        <TableCell>{displayCountry(download.country, download.ip_address)}</TableCell>
                        <TableCell className="capitalize">
                          {displayDeviceType(download.device_type, download.user_agent)}
                        </TableCell>
                        <TableCell>{displayOsName(download.os_name, download.user_agent)}</TableCell>
                        <TableCell>
                          <select
                            value={download.status}
                            onChange={(e) => void onDownloadStatusChange(download.id, e.target.value)}
                            className="rounded-md border border-white/10 bg-slate-800 px-2 py-1 text-xs"
                          >
                            <option value="clicked">clicked</option>
                            <option value="completed">completed</option>
                            <option value="failed">failed</option>
                          </select>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sky-300">
                          {download.destination_url || "—"}
                        </TableCell>
                        <TableCell>
                          <DeleteButton onDelete={() => void onDeleteDownload(download.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!downloads.length && (
                  <p className="py-8 text-center text-sm text-sky-200/60">No downloads yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="mt-6">
            <Card className="border-white/10 bg-slate-900 text-white">
              <CardHeader>
                <CardTitle>Page Visit Tracking</CardTitle>
                <CardDescription className="text-sky-200/70">
                  Homepage visits with IP address and referrer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visits.map((visit) => (
                      <TableRow key={visit.id} className="border-white/10">
                        <TableCell className="whitespace-nowrap text-sky-200/80">
                          {formatDate(visit.created_at)}
                        </TableCell>
                        <TableCell>{visit.path}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {visit.ip_address || "—"}
                        </TableCell>
                        <TableCell>{displayCountry(visit.country, visit.ip_address)}</TableCell>
                        <TableCell className="capitalize">
                          {displayDeviceType(visit.device_type, visit.user_agent)}
                        </TableCell>
                        <TableCell>{displayOsName(visit.os_name, visit.user_agent)}</TableCell>
                        <TableCell className="max-w-xs truncate text-sky-300">
                          {visit.referrer || "—"}
                        </TableCell>
                        <TableCell>
                          <DeleteButton onDelete={() => void onDeleteVisit(visit.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!visits.length && (
                  <p className="py-8 text-center text-sm text-sky-200/60">No visits yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-white/10 bg-slate-900 text-white">
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm text-sky-200/70">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-sky-200/50">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-sky-500/15 p-3">
          <Icon className="h-5 w-5 text-sky-300" />
        </div>
      </CardContent>
    </Card>
  );
}
