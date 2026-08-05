# Roadmap Penambahan Modal Batal

Dokumen ini melacak penambahan modal konfirmasi pembatalan ruangan pada halaman user.

## Daftar Task

- [x] **Task 1: Mengembalikan Route Default (User Page)**
  - Path: `frontend/next.config.ts`
  - Hapus atau nonaktifkan redirect dari `/` ke `/admin/overview` agar halaman user kembali menjadi default.

- [x] **Task 2: Menyiapkan Komponen Modal (Dialog)**
  - Path: `frontend/src/components/ui/dialog.tsx`
  - Jika belum ada, pasang komponen Dialog (misalnya dari shadcn atau Base UI) untuk pop-up konfirmasi.

- [x] **Task 3: Menambahkan Modal Pembatalan ke `ReservationCard`**
  - Path: `frontend/src/features/reservations/components/ReservationCard.tsx`
  - Bungkus tombol "Batalkan" dan "Batalkan Permintaan" dengan modal konfirmasi.
  - Tampilkan teks peringatan destruktif.

- [x] **Task 4: Audit & Pengecekan**
  - `npx tsc --noEmit` dan `npm run build`
  - Verifikasi di browser.
