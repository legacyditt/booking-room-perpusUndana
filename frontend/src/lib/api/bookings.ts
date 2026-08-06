import { client, unwrap } from "./client";
import type { Booking, BookingStatus } from "@/types/booking";

export function getUserBookings(userId: number): Promise<Booking[]> {
  return unwrap(client.get(`/bookings/user/${userId}`));
}

export function getBookings(): Promise<Booking[]> {
  return unwrap(client.get("/bookings"));
}

export function getBooking(id: number): Promise<Booking> {
  return unwrap(client.get(`/bookings/${id}`));
}

export function createBooking(input: {
  roomId: number;
  sessionId: number;
  userId: number;
  date: string;
}): Promise<Booking> {
  return unwrap(client.post("/bookings", input));
}

export function deleteBooking(id: number): Promise<void> {
  return unwrap(client.delete(`/bookings/${id}`));
}

export function updateBookingStatus(id: number, status: BookingStatus): Promise<Booking> {
  return unwrap(client.patch(`/bookings/${id}/status`, { status }));
}
