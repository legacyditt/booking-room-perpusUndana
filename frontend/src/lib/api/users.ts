import { client, unwrap } from "./client";
import type { AdminActivity, AdminUser } from "@/types/admin";

export function getUsers(
  cookie?: string,
  role?: "admin" | "user",
): Promise<AdminUser[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/users", { headers, params: role ? { role } : undefined }));
}

export function updateUserRole(id: string, role: string): Promise<AdminUser> {
  return unwrap(client.patch(`/users/${id}/role`, { role }));
}

export async function deleteUser(id: string): Promise<void> {
  await client.delete(`/users/${id}`);
}

export function getAdminActivities(
  cookie?: string,
  params?: Record<string, string>,
): Promise<AdminActivity[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/admin-activity", { headers, params }));
}

export async function downloadActivityLog(
  filters?: {
    adminId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  },
): Promise<void> {
  const res = await client.get("/admin-activity/export", {
    params: filters,
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LOG_AKTIVITAS_ADMIN_${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function createAdmins(
  emails: string[],
): Promise<{ data: AdminUser[]; failed: string[] }> {
  const res = await client.post<{ data: AdminUser[]; failed: string[] }>(
    "/users/admin",
    { emails },
  );
  return res.data;
}
