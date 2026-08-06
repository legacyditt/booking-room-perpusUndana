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
  userId: number;
  date: Date;
  status: BookingStatus;
  createdAt: Date;
  room: Room;
  session: Session;
}
