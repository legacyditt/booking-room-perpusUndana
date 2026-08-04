import { Booking, Session } from "@/types/booking";
import { format } from "date-fns";

// Hitung tanggal dinamis agar selalu relevan dengan hari ini
const today = new Date();
const pastDate = new Date(today);
pastDate.setDate(today.getDate() - 5); // 5 hari yang lalu

const futureDate1 = new Date(today);
futureDate1.setDate(today.getDate() + 2); // 2 hari ke depan

const futureDate2 = new Date(today);
futureDate2.setDate(today.getDate() + 5); // 5 hari ke depan

// Format ke YYYY-MM-DD
const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

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
  // 1. Upcoming (Confirmed)
  {
    id: "booking-1",
    roomId: "1", // Ruang Diskusi A
    sessionId: "session-1",
    userId: "user-123",
    date: formatDate(futureDate1),
    status: "Confirmed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
  },
  // 2. Upcoming (Pending)
  {
    id: "booking-2",
    roomId: "3", // Ruang Kolaborasi C (Premium)
    sessionId: "session-2",
    userId: "user-123",
    date: formatDate(futureDate2),
    status: "Pending",
    createdAt: new Date().toISOString(), 
  },
  // 3. Past (Confirmed)
  {
    id: "booking-3",
    roomId: "2", // Ruang Diskusi B
    sessionId: "session-1",
    userId: "user-123",
    date: formatDate(pastDate),
    status: "Confirmed",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Dibuat 10 hari lalu
  }
];
