import { StatCard } from "@/features/admin/components/StatCard";
import { DatabaseUsageCard } from "@/features/admin/components/DatabaseUsageCard";
import { RecentBookingsTable } from "@/features/admin/components/RecentBookingsTable";
import { QuickActions } from "@/features/admin/components/QuickActions";
import { mockAdminStats } from "@/data/mock";
import { getBookings, getDatabaseStats } from "@/lib/api";
import { getCookieHeader } from "@/lib/api/server";
import type { Booking } from "@/types/booking";
import type { DatabaseStats } from "@/types/database";

export const dynamic = "force-dynamic";

// ── Halaman Overview Admin ────────────────────────────────────────────────────
export default async function AdminOverviewPage() {
  const { cookie } = await getCookieHeader();

  // Pengambilan data paralel dengan isolasi error agar kegagalan satu API tidak merusak data lainnya
  const [bookings, dbStats] = await Promise.all([
    getBookings(cookie).catch(() => [] as Booking[]),
    getDatabaseStats(cookie).catch(() => undefined),
  ]);

  // Ambil 3 kartu statistik pertama (Total Booking Hari Ini, Menunggu Persetujuan, Booking Disetujui Bulan Ini)
  const topStats = mockAdminStats.slice(0, 3);

  return (
    <div className="p-8 space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-primary mb-1">
          Selamat datang, Admin! 👋
        </h1>
        <p className="text-neutral-500 text-sm">
          Ini adalah ringkasan aktivitas dan peminjaman ruangan hari ini.
        </p>
      </div>

      {/* ── Kartu Statistik (3 Metrik + 1 Database Usage Card) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
        {/* Card ke-4: Penggunaan Database dengan Progress Bar */}
        <DatabaseUsageCard stats={dbStats} />
      </div>

      {/* ── Baris Bawah: Tabel + Quick Actions (berdampingan) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabel mengambil 2 kolom dari 3 */}
        <div className="lg:col-span-2 min-w-0">
          <RecentBookingsTable bookings={bookings.slice(0, 5)} />
        </div>

        {/* Quick Actions mengambil 1 kolom dari 3 */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
