import type { Room } from "./room";

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type BookingType = "SEAT" | "ROOM";

export interface Session {
  id: number;
  name: string;
  startTime: string;
  finishTime: string;
  createdBy?: { name: string };
  updatedBy?: { name: string };
}

export interface Booking {
  id: number;
  roomId: number;
  sessionId: number;
  userId: string;
  date: string;
  status: BookingStatus;
  type: BookingType;
  createdAt: string;
  room: Room;
  session: Session;
  user?: { name: string };
  admin?: { name: string };
}
