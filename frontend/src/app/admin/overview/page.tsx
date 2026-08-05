export default function AdminOverviewPage() {
  return (
    <div className="p-8">
      {/* Header Halaman */}
      <h1 className="text-4xl font-serif font-bold text-primary mb-2">
        Selamat datang, Admin! 👋
      </h1>
      <p className="text-neutral-500 mb-8">
        Ini adalah ringkasan aktivitas dan peminjaman ruangan hari ini.
      </p>

      {/* Placeholder Konten */}
      <div className="p-10 border-2 border-dashed border-neutral-300 rounded-xl flex items-center justify-center bg-white/50">
        <p className="text-neutral-500 font-medium text-lg">
          [ Kartu Statistik & Tabel Peminjaman — Segera hadir ]
        </p>
      </div>
    </div>
  );
}
