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

export async function createAdmins(
  emails: string[],
): Promise<{ data: AdminUser[]; failed: string[] }> {
  const res = await client.post<{ data: AdminUser[]; failed: string[] }>(
    "/users/admin",
    { emails },
  );
  return res.data;
}
