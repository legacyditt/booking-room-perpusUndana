import { client, unwrap } from "./client";
import type { AdminUser } from "@/types/admin";

export function getUsers(): Promise<AdminUser[]> {
  return unwrap(client.get("/users"));
}

export function updateUserRole(id: string, role: string): Promise<AdminUser> {
  return unwrap(client.patch(`/users/${id}/role`, { role }));
}
