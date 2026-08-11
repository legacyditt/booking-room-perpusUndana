import { User, Role } from "@/types/user";
import { Room } from "@/types/room";
import { Booking, Session } from "@/types/booking";
import {
  AdminStat,
  RecentBookingRow,
} from "@/types/admin";

// ── Enum & Interface lokal ──────────────────────────────────────────────────
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

// ── Mock Data User ──────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin Utama",
    email: "admin@undana.ac.id",
    password: "hashedpassword123",
    role: Role.ADMIN,
  },
  {
    id: 2,
    name: "Budi Mahasiswa",
    email: "budi@student.undana.ac.id",
    password: "hashedpassword123",
    role: Role.USER,
  },
  {
    id: 3,
    name: "Siti Mahasiswa",
    email: "siti@student.undana.ac.id",
    password: "hashedpassword123",
    role: Role.USER,
  },
];

export const mockRooms: Room[] = [
  {
    id: 1,
    name: "Ruang Archibald",
    capacity: 2,
    imageUrl: "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Ruang+Archibald",
  },
  {
    id: 2,
    name: "Ruang Kolaborasi A",
    capacity: 4,
    imageUrl:
      "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Ruang+Kolaborasi+A",
  },
  {
    id: 3,
    name: "Ruang Diskusi C",
    capacity: 6,
    imageUrl: "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Ruang+Diskusi+C",
  },
  {
    id: 4,
    name: "Auditorium Mini",
    capacity: 20,
    imageUrl: "https://placehold.co/600x400/e2e8f0/4a4a4a?text=Auditorium+Mini",
  },
];

export const mockSessions: Session[] = [
  { id: 1, name: "Sesi Pagi", startTime: "08:00", finishTime: "12:00" },
  { id: 2, name: "Sesi Siang", startTime: "13:00", finishTime: "17:00" },
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
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    status: BookingStatus.APPROVED,
    createdAt: new Date().toISOString(),
    room: mockRooms[0],
    session: mockSessions[0],
  },
  {
    id: 2,
    roomId: 2,
    sessionId: 2,
    userId: 3,
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    status: BookingStatus.PENDING,
    createdAt: new Date().toISOString(),
    room: mockRooms[1],
    session: mockSessions[1],
  },
  {
    id: 3,
    roomId: 4,
    sessionId: 2,
    userId: 2,
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    status: BookingStatus.REJECTED,
    createdAt: new Date().toISOString(),
    room: mockRooms[3],
    session: mockSessions[1],
  },
  {
    id: 4,
    roomId: 1,
    sessionId: 1,
    userId: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    status: BookingStatus.APPROVED,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    room: mockRooms[0],
    session: mockSessions[0],
  },
  {
    id: 5,
    roomId: 3,
    sessionId: 1,
    userId: 2,
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    status: BookingStatus.APPROVED,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    room: mockRooms[2],
    session: mockSessions[0],
  },
];

// Mock data untuk Admin
export const mockAdminStats: AdminStat[] = [
  {
    id: "total-bookings",
    label: "Total Booking Hari Ini",
    value: 8,
    trend: "+12% dari kemarin",
    trendPositive: true,
  },
  {
    id: "pending-approvals",
    label: "Menunggu Persetujuan",
    value: 3,
    subtext: "Perlu perhatian",
  },
  {
    id: "active-users",
    label: "Pengguna Aktif",
    value: 12,
    subtext: "Sedang menggunakan ruangan",
  },
  {
    id: "room-occupancy",
    label: "Tingkat Okupansi Ruangan",
    value: "75%",
    progress: 75,
  },
];

export const mockRecentBookings: RecentBookingRow[] = [
  {
    id: 1,
    userName: "Budi Mahasiswa",
    roomName: "Ruang Archibald",
    sessionTimeRange: "08:00 - 12:00",
    status: "APPROVED",
    date: "5 Agu 2026",
  },
  {
    id: 2,
    userName: "Siti Mahasiswa",
    roomName: "Ruang Kolaborasi A",
    sessionTimeRange: "13:00 - 17:00",
    status: "PENDING",
    date: "6 Agu 2026",
  },
  {
    id: 3,
    userName: "Budi Mahasiswa",
    roomName: "Auditorium Mini",
    sessionTimeRange: "13:00 - 17:00",
    status: "REJECTED",
    date: "7 Agu 2026",
  },
  {
    id: 4,
    userName: "Siti Mahasiswa",
    roomName: "Ruang Diskusi C",
    sessionTimeRange: "08:00 - 12:00",
    status: "APPROVED",
    date: "3 Agu 2026",
  },
  {
    id: 5,
    userName: "Budi Mahasiswa",
    roomName: "Ruang Archibald",
    sessionTimeRange: "08:00 - 12:00",
    status: "CANCELLED",
    date: "31 Jul 2026",
  },
];
