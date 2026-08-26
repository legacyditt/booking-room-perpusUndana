# Migration Plan — Pindah Ownership + Switch ke Neon

- [x] Fork repo ke akun baru
- [x] Buat Neon database + push schema + migrasi data
  - Signup neon.tech, buat project
  - Catat: connection string, project ID, generate API key
  - `npx prisma db push` untuk push schema
  - Export/import data dari Prisma Postgres lama
- [ ] Buat S3 bucket baru + migrasi gambar
  - Login t3.storage.dev, buat bucket baru
  - Download semua object dari bucket lama, upload ke baru
- [ ] Buat Gmail app password baru
  - Buat akun Gmail baru / pakai yang ada
  - Aktifkan 2FA, generate App Password
- [ ] Generate auth secrets baru
  - `openssl rand -hex 32` (2x untuk JWT_SECRET + BETTER_AUTH_SECRET)
  - Catat production URLs untuk BETTER_AUTH_URL + FRONTEND_URL
- [x] Update prismaManagement.ts (Prisma API → Neon API)
  - Ganti implementasi `getDatabaseStorageUsage()` pakai `pg_database_size()` langsung
  - Hapus NEON_API_KEY + NEON_PROJECT_ID dari env (tidak dipakai)
- [x] Update backend/.env (10 env vars)
  ```
  DATABASE_URL=<Neon connection string>
  DIRECT_URL=<Neon connection string>
  JWT_SECRET=<generate baru>
  BETTER_AUTH_SECRET=<generate baru>
  BETTER_AUTH_URL=<production backend URL>
  FRONTEND_URL=<production frontend URL>
  EMAIL_USER=<gmail baru>
  EMAIL_APP_PASSWORD=<app password baru>
  S3_ACCESS_KEY_ID=<key baru>
  S3_SECRET_ACCESS_KEY=<secret baru>
  S3_BUCKET=<nama bucket baru>
  ```
- [ ] Update frontend/.env.local (1 var)
  ```
  NEXT_PUBLIC_API_URL=<production backend URL>
  ```
- [ ] Setup Vercel + deploy
  - Import repo baru, setup env vars di dashboard
- [ ] Test semua fitur
  - Login/register, booking, email, upload gambar
  - Admin overview (storage usage), download backup Excel
- [ ] Revoke credentials lama
  - Delete Prisma Postgres DB, S3 bucket, Gmail app password lama
