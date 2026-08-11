import { client, unwrap } from "./client";
import type { Room } from "@/types/room";

export function getRooms(cookie?: string): Promise<Room[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/rooms", { headers }));
}

export function getRoom(id: number, cookie?: string): Promise<Room> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get(`/rooms/${id}`, { headers }));
}

export function createRoom(input: { name: string; capacity: number; imageUrl: string }): Promise<Room> {
  return unwrap(client.post("/rooms", input));
}

export function updateRoom(id: number, input: { name: string; capacity: number; imageUrl: string }): Promise<Room> {
  return unwrap(client.put(`/rooms/${id}`, input));
}

export function deleteRoom(id: number): Promise<Room> {
  return unwrap(client.delete(`/rooms/${id}`));
}
