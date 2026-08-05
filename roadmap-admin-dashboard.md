# Roadmap Dasbor Admin & Pengalihan Route

- [x] **Task 1: Persiapan Repository & Branch**
  - Buat branch baru untuk fitur ini.
  
- [x] **Task 2: Mengubah Halaman Root (Route Redirect)**
  - Ubah `frontend/next.config.ts` agar melakukan `redirect` ke `/admin/overview`.

- [x] **Task 3: Membuat Layout Admin (`admin/layout.tsx`)**
  - Setup file `frontend/src/app/admin/layout.tsx`.
  - Buat struktur grid/flex untuk Sidebar dan Main Content.

- [x] **Task 4: Membuat Komponen Sidebar (`Sidebar.tsx`)**
  - Buat komponen di `frontend/src/features/admin/components/Sidebar.tsx`.
  - Integrasikan ikon navigasi dan layout profil admin di bagian bawah sesuai desain.

- [x] **Task 5: Membuat Halaman Overview Admin (`admin/overview/page.tsx`)**
  - Setup file `frontend/src/app/admin/overview/page.tsx` dengan struktur sederhana sebagai placeholder.

- [x] **Task 6: Audit & Pengecekan**
  - Jalankan `npm run build` dan `npx tsc --noEmit`.
  - Review UI di browser untuk memastikan redirect berjalan dan layout sesuai.

- [x] **Task 7: Commit Changes**
  - Simpan dan commit pekerjaan ke repository.
