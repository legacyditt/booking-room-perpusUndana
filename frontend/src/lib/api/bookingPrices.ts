import { client, unwrap } from "./client";
import type { BookingPrice } from "@/types/room";

export function getBookingPrices(): Promise<BookingPrice[]> {
  return unwrap(client.get("/booking-prices"));
}

export function getBookingPriceByRoom(roomId: number): Promise<BookingPrice> {
  return unwrap(client.get(`/booking-prices/${roomId}`));
}

export function createBookingPrice(input: { roomId: number; price: number }): Promise<BookingPrice> {
  return unwrap(client.post("/booking-prices", input));
}

export function updateBookingPrice(roomId: number, price: number): Promise<BookingPrice> {
  return unwrap(client.put(`/booking-prices/${roomId}`, { price }));
}

export function deleteBookingPrice(roomId: number): Promise<BookingPrice> {
  return unwrap(client.delete(`/booking-prices/${roomId}`));
}
