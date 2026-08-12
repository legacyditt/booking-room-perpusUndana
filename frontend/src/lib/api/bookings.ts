import { client, unwrap } from "./client";
import type { Booking, BookingStatus } from "@/types/booking";

export function getUserBookings(cookie?: string): Promise<Booking[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/bookings/me", { headers }));
}

export function getBookings(cookie?: string): Promise<Booking[]> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get("/bookings", { headers }));
}

export function getBooking(id: number, cookie?: string): Promise<Booking> {
  const headers = cookie ? { cookie } : undefined;
  return unwrap(client.get(`/bookings/${id}`, { headers }));
}

export function createBooking(input: {
  roomId: number;
  sessionId: number;
  date: string;
}): Promise<Booking> {
  return unwrap(client.post("/bookings", input));
}

export function deleteBooking(id: number): Promise<void> {
  return unwrap(client.delete(`/bookings/${id}`));
}

export function cancelBooking(id: number): Promise<Booking> {
  return unwrap(client.patch(`/bookings/${id}/cancel`));
}

export function updateBookingStatus(
  id: number,
  status: BookingStatus,
): Promise<Booking> {
  return unwrap(client.patch(`/bookings/${id}/status`, { status }));
}

export function updateBooking(
  id: number,
  input: {
    date: string;
    sessionId: number;
  },
): Promise<Booking> {
  return unwrap(client.patch(`/bookings/${id}`, input));
}
