import prisma from "../src/lib/prisma";
import { hashPassword } from "@better-auth/utils/password";
import { BookingStatus } from "../src/generated/prisma/enums";
import { BookingType } from "../src/generated/prisma/enums";

const userPassword = "delano_MAHASISWA123";
const adminPassword = "admin_PERPUSTAKAAN123";

const usersData = [
  {
    id: "admin-uuid-1",
    name: "Admin Perpustakaan",
    email: "adminperpus@gmail.com",
    role: "admin",
    status: "dosen",
    idNumber: "111122223333",
    whatsapp: "081234567890",
    affiliation: "Ilmu Komputer",
  },
  {
    id: "admin-uuid-2",
    name: "Rio Seran",
    email: "rioseran@gmail.com",
    role: "admin",
    status: "dosen",
    idNumber: "111122223334",
    whatsapp: "08120000003",
    affiliation: "Ilmu Komputer",
  },
  {
    id: "admin-uuid-3",
    name: "Pier Nedebang",
    email: "piernedebang@gmail.com",
    role: "admin",
    status: "dosen",
    idNumber: "111122223335",
    whatsapp: "08120000004",
    affiliation: "Ilmu Komputer",
  },
  {
    id: "user-uuid-1",
    name: "Delano Manafe",
    email: "delanomanafe05@gmail.com",
    role: "user",
    status: "mahasiswa",
    idNumber: "220000001",
    whatsapp: "08120000001",
    affiliation: "Ilmu Komputer",
  },
  {
    id: "user-uuid-2",
    name: "Samuel",
    email: "samuel@gmail.com",
    role: "user",
    status: "mahasiswa",
    idNumber: "220000002",
    whatsapp: "08120000002",
    affiliation: "Ilmu Komputer",
  },
  {
    id: "user-uuid-3",
    name: "Nada Cantika",
    email: "nada.cantika@gmail.com",
    role: "user",
    status: "mahasiswa",
    idNumber: "220000003",
    whatsapp: "08120000005",
    affiliation: "Teknik Informatika",
  },
  {
    id: "user-uuid-4",
    name: "Silvester Tena",
    email: "silvester.tena@gmail.com",
    role: "user",
    status: "mahasiswa",
    idNumber: "220000004",
    whatsapp: "08120000006",
    affiliation: "Sistem Informasi",
  },
  {
    id: "user-uuid-5",
    name: "Krisostomus Sega",
    email: "krisostomus.sega@gmail.com",
    role: "user",
    status: "mahasiswa",
    idNumber: "220000005",
    whatsapp: "08120000007",
    affiliation: "Ilmu Komputer",
  },
  {
    id: "user-uuid-6",
    name: "Betsheba Bilik",
    email: "betshebabilik@gmail.com",
    role: "user",
    status: "dosen",
    idNumber: "220000006",
    whatsapp: "08120000008",
    affiliation: "Teknik Informatika",
  },
  {
    id: "user-uuid-7",
    name: "Refly Ndolu",
    email: "refly.ndolu@gmail.com",
    role: "user",
    status: "mahasiswa",
    idNumber: "220000007",
    whatsapp: "08120000009",
    affiliation: "Sistem Informasi",
  },
];

type SeedUser = (typeof usersData)[number];

async function seedUser(u: SeedUser, passwordHash: string) {
  await prisma.user.create({
    data: {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      idNumber: u.idNumber,
      whatsapp: u.whatsapp,
      affiliation: u.affiliation,
      accounts: {
        create: {
          id: `acc-${u.id}`,
          accountId: u.email,
          providerId: "credential",
          password: passwordHash,
        },
      },
    },
  });
}

const roomsData = [
  { name: "Aula Besar", capacity: 10, imageUrl: "https://picsum.photos/id/48/5000/3333", createdById: "admin-uuid-1" },
  { name: "Ruang Rapat 1", capacity: 6, imageUrl: "https://picsum.photos/id/311/367/267", createdById: "admin-uuid-1" },
  { name: "Ruang Rapat 2", capacity: 4, imageUrl: "https://picsum.photos/id/445/4256/2819", createdById: "admin-uuid-2" },
  { name: "Ruang Diskusi", capacity: 8, imageUrl: "https://picsum.photos/id/504/367/267", createdById: "admin-uuid-2" },
  { name: "Ruang Seminar", capacity: 20, imageUrl: "https://picsum.photos/id/201/367/267", createdById: "admin-uuid-3" },
  { name: "Ruang Belajar A", capacity: 5, imageUrl: "https://picsum.photos/id/320/367/267", createdById: "admin-uuid-3" },
];

const prices = [
  { name: "Aula Besar", price: 500000 },
  { name: "Ruang Diskusi", price: 200000 },
  { name: "Ruang Seminar", price: 750000 },
  { name: "Ruang Belajar A", price: 100000 },
];

const bookingSessionsData = [
  { name: "Pagi", startTime: "08:00", finishTime: "12:00" },
  { name: "Siang", startTime: "12:00", finishTime: "16:00" },
  { name: "Sore", startTime: "16:00", finishTime: "20:00" },
];

async function main() {
  await prisma.adminActivityLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.bookingPrice.deleteMany();
  await prisma.room.deleteMany();
  await prisma.bookingSession.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  await prisma.systemSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      days: "senin,selasa,rabu,kamis,jumat",
      whatsapp: "081234567890",
    },
    update: { days: "senin,selasa,rabu,kamis,jumat" },
  });

  const adminPasswordHash = await hashPassword(adminPassword);
  const userPasswordHash = await hashPassword(userPassword);

  for (const u of usersData) {
    await seedUser(u, u.role === "admin" ? adminPasswordHash : userPasswordHash);
  }

  await prisma.room.createMany({ data: roomsData });
  const rooms = await prisma.room.findMany();
  const roomByName = new Map(rooms.map((r) => [r.name, r]));

  await Promise.all(
    prices.map(({ name, price }) =>
      prisma.bookingPrice.upsert({
        where: { roomId: roomByName.get(name)!.id },
        create: { roomId: roomByName.get(name)!.id, price },
        update: { price },
      })
    )
  );

  await prisma.bookingSession.createMany({ data: bookingSessionsData });
  const bookingSessions = await prisma.bookingSession.findMany();
  const pagiSession = bookingSessions.find((s) => s.name === "Pagi")!;
  const siangSession = bookingSessions.find((s) => s.name === "Siang")!;
  const soreSession = bookingSessions.find((s) => s.name === "Sore")!;

const bookingsData = [
  // Agustus 2026
  { roomId: roomByName.get("Aula Besar")!.id, sessionId: pagiSession.id, userId: "user-uuid-1", date: new Date("2026-08-04"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Aula Besar")!.id, sessionId: siangSession.id, userId: "user-uuid-2", date: new Date("2026-08-04"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Rapat 1")!.id, sessionId: pagiSession.id, userId: "user-uuid-3", date: new Date("2026-08-05"), status: BookingStatus.PENDING, type: BookingType.SEAT, decidedById: null },
  { roomId: roomByName.get("Ruang Rapat 2")!.id, sessionId: soreSession.id, userId: "user-uuid-4", date: new Date("2026-08-05"), status: BookingStatus.REJECTED, type: BookingType.SEAT, decidedById: "admin-uuid-2" },
  { roomId: roomByName.get("Ruang Diskusi")!.id, sessionId: siangSession.id, userId: "user-uuid-5", date: new Date("2026-08-06"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Seminar")!.id, sessionId: pagiSession.id, userId: "user-uuid-6", date: new Date("2026-08-06"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-2" },
  { roomId: roomByName.get("Ruang Belajar A")!.id, sessionId: soreSession.id, userId: "user-uuid-7", date: new Date("2026-08-07"), status: BookingStatus.PENDING, type: BookingType.SEAT, decidedById: null },
  { roomId: roomByName.get("Aula Besar")!.id, sessionId: pagiSession.id, userId: "user-uuid-1", date: new Date("2026-08-10"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Rapat 1")!.id, sessionId: siangSession.id, userId: "user-uuid-2", date: new Date("2026-08-10"), status: BookingStatus.CANCELLED, type: BookingType.SEAT, decidedById: null },
  { roomId: roomByName.get("Ruang Diskusi")!.id, sessionId: pagiSession.id, userId: "user-uuid-3", date: new Date("2026-08-11"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-3" },
  { roomId: roomByName.get("Ruang Seminar")!.id, sessionId: soreSession.id, userId: "user-uuid-4", date: new Date("2026-08-11"), status: BookingStatus.PENDING, type: BookingType.SEAT, decidedById: null },
  { roomId: roomByName.get("Ruang Belajar A")!.id, sessionId: pagiSession.id, userId: "user-uuid-5", date: new Date("2026-08-12"), status: BookingStatus.APPROVED, type: BookingType.SEAT, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Aula Besar")!.id, sessionId: siangSession.id, userId: "user-uuid-6", date: new Date("2026-08-12"), status: BookingStatus.REJECTED, type: BookingType.ROOM, decidedById: "admin-uuid-2" },
  { roomId: roomByName.get("Ruang Rapat 2")!.id, sessionId: pagiSession.id, userId: "user-uuid-7", date: new Date("2026-08-13"), status: BookingStatus.APPROVED, type: BookingType.SEAT, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Diskusi")!.id, sessionId: soreSession.id, userId: "user-uuid-1", date: new Date("2026-08-13"), status: BookingStatus.PENDING, type: BookingType.SEAT, decidedById: null },

  // Juli 2026
  { roomId: roomByName.get("Aula Besar")!.id, sessionId: pagiSession.id, userId: "user-uuid-2", date: new Date("2026-07-01"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Seminar")!.id, sessionId: siangSession.id, userId: "user-uuid-3", date: new Date("2026-07-02"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-2" },
  { roomId: roomByName.get("Ruang Rapat 1")!.id, sessionId: soreSession.id, userId: "user-uuid-4", date: new Date("2026-07-03"), status: BookingStatus.REJECTED, type: BookingType.SEAT, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Belajar A")!.id, sessionId: pagiSession.id, userId: "user-uuid-5", date: new Date("2026-07-07"), status: BookingStatus.APPROVED, type: BookingType.SEAT, decidedById: "admin-uuid-3" },
  { roomId: roomByName.get("Ruang Diskusi")!.id, sessionId: siangSession.id, userId: "user-uuid-6", date: new Date("2026-07-08"), status: BookingStatus.CANCELLED, type: BookingType.SEAT, decidedById: null },
  { roomId: roomByName.get("Aula Besar")!.id, sessionId: soreSession.id, userId: "user-uuid-7", date: new Date("2026-07-09"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Rapat 2")!.id, sessionId: pagiSession.id, userId: "user-uuid-1", date: new Date("2026-07-14"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-2" },
  { roomId: roomByName.get("Ruang Seminar")!.id, sessionId: siangSession.id, userId: "user-uuid-2", date: new Date("2026-07-15"), status: BookingStatus.PENDING, type: BookingType.SEAT, decidedById: null },
  { roomId: roomByName.get("Ruang Diskusi")!.id, sessionId: pagiSession.id, userId: "user-uuid-3", date: new Date("2026-07-21"), status: BookingStatus.APPROVED, type: BookingType.ROOM, decidedById: "admin-uuid-1" },
  { roomId: roomByName.get("Ruang Belajar A")!.id, sessionId: soreSession.id, userId: "user-uuid-4", date: new Date("2026-07-22"), status: BookingStatus.REJECTED, type: BookingType.SEAT, decidedById: "admin-uuid-3" },
];

  await prisma.booking.createMany({ data: bookingsData });

  const users = await prisma.user.findMany();
  console.log(
    `Seeded: ${users.length} users, ${rooms.length} rooms, ${bookingSessions.length} sessions, ${bookingsData.length} bookings`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });