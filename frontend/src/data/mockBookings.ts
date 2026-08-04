import { Booking, Session } from "@/types/booking";

export const librarySessions: Session[] = [
  {
    id: "session-1",
    name: "Sesi 1 (Pagi)",
    timeRange: "08:00 - 12:00",
  },
  {
    id: "session-2",
    name: "Sesi 2 (Siang)",
    timeRange: "13:00 - 17:00",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    roomId: "1", // Ruang Archibald
    sessionId: "session-1",
    userId: "user-123",
    date: "2026-08-04",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
];
