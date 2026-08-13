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
    id: "approved-this-month",
    label: "Booking Disetujui Bulan Ini",
    value: 42,
    subtext: "Agustus 2026",
  },
  {
    id: "total-rooms",
    label: "Total Ruangan Tersedia",
    value: 4,
    subtext: "Siap untuk dipesan",
  },
];
