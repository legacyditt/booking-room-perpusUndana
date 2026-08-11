import { client, unwrap } from "./client";
import type { AdminUser } from "@/types/admin";

export function getUsers(cookie?: string): Promise<AdminUser[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/users", { headers }));
}

export function updateUserRole(id: string, role: string): Promise<AdminUser> {
  return unwrap(client.patch(`/users/${id}/role`, { role }));
}
