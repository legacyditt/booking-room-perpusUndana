import { StatCard } from "@/features/admin/components/StatCard";
import { RecentBookingsTable } from "@/features/admin/components/RecentBookingsTable";
import { QuickActions } from "@/features/admin/components/QuickActions";
import { mockAdminStats, mockRecentBookings } from "@/data/mock";

// ── Halaman Overview Admin ────────────────────────────────────────────────────
export default function AdminOverviewPage() {
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

      {/* ── Kartu Statistik ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockAdminStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* ── Baris Bawah: Tabel + Quick Actions (berdampingan) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabel mengambil 2 kolom dari 3 */}
        <div className="lg:col-span-2">
          <RecentBookingsTable bookings={mockRecentBookings} />
        </div>

        {/* Quick Actions mengambil 1 kolom dari 3 */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
