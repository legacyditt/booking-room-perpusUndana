import { AdminStat } from "@/types/admin";

// ── Mock data untuk Admin ────────────────────────────────────────────────────
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
