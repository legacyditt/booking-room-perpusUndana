import { client, unwrap } from "./client";
import type { Session } from "@/types/booking";

export function getSessions(cookie?: string): Promise<Session[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/sessions", { headers }));
}

export function getSession(id: number, cookie?: string): Promise<Session> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get(`/sessions/${id}`, { headers }));
}

export function createSession(input: { name: string; startTime: string; finishTime: string }): Promise<Session> {
  return unwrap(client.post("/sessions", input));
}

export function updateSession(
  id: number,
  input: { name: string; startTime: string; finishTime: string }
): Promise<Session> {
  return unwrap(client.put(`/sessions/${id}`, input));
}

export function deleteSession(id: number): Promise<Session> {
  return unwrap(client.delete(`/sessions/${id}`));
}
