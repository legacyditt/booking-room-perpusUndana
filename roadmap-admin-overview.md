# Roadmap Halaman Overview Admin

> Referensi desain: Screenshot dashboard admin yang diberikan user.

## Breakdown Komponen

Halaman overview akan terdiri dari 3 bagian utama:
1. **Kartu Statistik** — 4 buah kartu berisi angka ringkasan
2. **Tabel Peminjaman Terbaru** — daftar 4-5 peminjaman terakhir
3. **Aksi Cepat** — tombol shortcut untuk aksi umum admin

---

## Daftar Task

- [x] **Task 1: Menyiapkan Mock Data Admin**
  - Tambahkan data statistik & tabel ke `frontend/src/data/mock.ts` (karena belum ada endpoint API)
  - Data: `mockAdminStats` dan `mockRecentBookings` (versi denormalisasi dengan nama user & ruangan)

- [x] **Task 2: Membuat Komponen `StatCard`**
  - Path: `frontend/src/features/admin/components/StatCard.tsx`
  - Menerima props: `label`, `value`, `icon`, `subtext`, `variant` (untuk progress bar khusus Room Occupancy)

- [x] **Task 3: Membuat Komponen `RecentBookingsTable`**
  - Path: `frontend/src/features/admin/components/RecentBookingsTable.tsx`
  - Menerima data peminjaman dan menampilkannya dalam tabel dengan badge status berwarna

- [x] **Task 4: Membuat Komponen `QuickActions`**
  - Path: `frontend/src/features/admin/components/QuickActions.tsx`
  - Berisi tombol "Tambah Ruangan Baru" dan "Buat Laporan"

- [/] **Task 5: Merakit Semua Komponen ke `overview/page.tsx`**
  - Impor dan rakit semua komponen di halaman `frontend/src/app/admin/overview/page.tsx`
  - Atur layout: header → stat cards → tabel + quick actions berdampingan

- [ ] **Task 6: Audit & Pengecekan**
  - `npx tsc --noEmit` dan `npm run build`
  - Verifikasi tampilan di browser

- [ ] **Task 7: Commit & Push**
  - Commit dengan pesan konvensional dan push ke branch yang aktif
