import { client, unwrap } from "./client";
import type { AdminUser } from "@/types/admin";

export function getUsers(cookie?: string): Promise<AdminUser[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/users", { headers }));
}

export function updateUserRole(id: string, role: string): Promise<AdminUser> {
  return unwrap(client.patch(`/users/${id}/role`, { role }));
}

export async function deleteUser(id: string): Promise<void> {
  await client.delete(`/users/${id}`);
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
