# Academia Libri - Project Roadmap

Roadmap ini menggunakan prinsip **Clean Architecture**, **Separation of Concerns**, dan metodologi **Superpowers** (dipecah menjadi tugas-tugas kecil).

---

## ✅ Selesai
- [x] **Task 0**: Setup konfigurasi AI Agent (`AGENTS.md`, `.gitignore`).
- [x] **Task 1**: Setup tema (tipografi Playfair & Inter, palet warna Athenaeum Scholar) dan instalasi komponen Shadcn UI dasar.

## 🚀 Sedang Dikerjakan (Next)
- [ ] **Task 2: Layer Data & Domain**
  - [ ] Membuat tipe data TypeScript (`src/types/room.ts`).
  - [ ] Membuat mock data (`src/data/mockRooms.ts`) sesuai referensi.
  - *Branch suggestion:* `git checkout -b chore/setup-data-layer`

## 📋 Antrean Task (To-Do)

### Task 3: Komponen Reusable (UI / Features)
- [ ] `Header.tsx`: Navbar dengan logo Serif, link navigasi, search bar, dan tombol Sign In.
- [ ] `Footer.tsx`: Footer dengan hak cipta dan tautan.
- [ ] `RoomCard.tsx`: Komponen kartu untuk masing-masing ruangan.
- [ ] `RoomFilters.tsx`: Checkbox filter (Available Now, Include Unavailable).
- *Branch suggestion:* `git checkout -b feat/feature-components`

### Task 4: Halaman Utama (Page Layer)
- [ ] Menyatukan `Header`, `RoomFilters`, `RoomCard` list, dan `Footer` di `src/app/page.tsx`.
- [ ] Menambahkan *state* sederhana untuk menangani logika filter.
- *Branch suggestion:* `git checkout -b feat/home-page-integration`

### Task 5: Finishing & Verifikasi
- [ ] Cek responsivitas (Mobile, Tablet, Desktop) merujuk aturan UI/UX Pro Max.
- [ ] Cek *accessibility* (kontras warna, alt text, focus outline).
- [ ] Uji coba *build* (`npm run build`).
- *Branch suggestion:* `git checkout -b fix/ui-ux-polishing`
