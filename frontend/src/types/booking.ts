import type { Room } from "./room";

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Session {
  id: number;
  name: string;
  startTime: string;
  finishTime: string;
}

export interface Booking {
  id: number;
  roomId: number;
  sessionId: number;
  userId: string;
  date: string;
  status: BookingStatus;
  createdAt: string;
  room: Room;
  session: Session;
  user?: { name: string };
}
