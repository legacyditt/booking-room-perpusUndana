import { client, unwrap } from "./client";
import type { Session } from "@/types/booking";

export function getSessions(): Promise<Session[]> {
  return unwrap(client.get("/sessions"));
}

export function getSession(id: number): Promise<Session> {
  return unwrap(client.get(`/sessions/${id}`));
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
