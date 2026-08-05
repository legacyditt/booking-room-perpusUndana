import { User, Role } from "@/types/user";
import { Room } from "@/types/room";
import { Booking, Session } from "@/types/booking";

export enum BookingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export interface BookingPrice {
  roomId: number;
  price: number;
}

export const mockUsers: User[] = [
  { id: 1, name: "Admin Utama", email: "admin@undana.ac.id", password: "hashedpassword123", role: Role.ADMIN },
  { id: 2, name: "Budi Mahasiswa", email: "budi@student.undana.ac.id", password: "hashedpassword123", role: Role.USER },
  { id: 3, name: "Siti Mahasiswa", email: "siti@student.undana.ac.id", password: "hashedpassword123", role: Role.USER },
];

export const mockRooms: Room[] = [
  { id: 1, name: "Ruang Archibald", capacity: 2, imageUrl: "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Ruang+Archibald" },
  { id: 2, name: "Ruang Kolaborasi A", capacity: 4, imageUrl: "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Ruang+Kolaborasi+A" },
  { id: 3, name: "Ruang Diskusi C", capacity: 6, imageUrl: "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Ruang+Diskusi+C" },
  { id: 4, name: "Auditorium Mini", capacity: 20, imageUrl: "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Auditorium+Mini" },
];

export const mockSessions: Session[] = [
  { id: 1, name: "Sesi Pagi 1", timeRange: "08:00 - 10:00" },
  { id: 2, name: "Sesi Pagi 2", timeRange: "10:00 - 12:00" },
  { id: 3, name: "Sesi Siang 1", timeRange: "13:00 - 15:00" },
  { id: 4, name: "Sesi Siang 2", timeRange: "15:00 - 17:00" },
];

export const mockBookingPrices: BookingPrice[] = [
  { roomId: 3, price: 50000 },
  { roomId: 4, price: 100000 },
];

export const mockBookings: Booking[] = [
  {
    id: 1,
    roomId: 1,
    sessionId: 1,
    userId: 2,
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    status: BookingStatus.APPROVED,
    createdAt: new Date(),
  },
  {
    id: 2,
    roomId: 2,
    sessionId: 3,
    userId: 3,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: BookingStatus.PENDING,
    createdAt: new Date(),
  },
  {
    id: 3,
    roomId: 4,
    sessionId: 2,
    userId: 2,
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: BookingStatus.REJECTED,
    createdAt: new Date(),
  },
];
