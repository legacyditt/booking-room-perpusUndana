import type { Booking } from "@/types/booking";

export const isSeatApproved = (booking: Booking) =>
  booking.type === "SEAT" && booking.status === "APPROVED";
