import prisma from "../src/lib/prisma";
import { hashPassword } from "@better-auth/utils/password";
import { BookingStatus } from "../src/generated/prisma/enums";

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
  { name: "Aula Besar", capacity: 10, imageUrl: "https://picsum.photos/id/48/5000/3333" },
  { name: "Ruang Rapat 1", capacity: 6, imageUrl: "https://picsum.photos/id/311/367/267" },
  { name: "Ruang Rapat 2", capacity: 4, imageUrl: "https://picsum.photos/id/445/4256/2819" },
  { name: "Ruang Diskusi", capacity: 8, imageUrl: "https://picsum.photos/id/504/367/267" },
];

const prices = [
  { name: "Aula Besar", price: 500000 },
  { name: "Ruang Diskusi", price: 200000 },
];

const bookingSessionsData = [
  { name: "Pagi", startTime: "08:00", finishTime: "12:00" },
  { name: "Siang", startTime: "12:00", finishTime: "16:00" },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.bookingPrice.deleteMany();
  await prisma.room.deleteMany();
  await prisma.bookingSession.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  await prisma.workingDays.upsert({
    where: { id: 1 },
    create: { id: 1, days: "senin,selasa,rabu,kamis,jumat" },
    update: { days: "senin,selasa,rabu,kamis,jumat" },
  });

  // Menggunakan fungsi bawaan dari BetterAuth untuk hashing
  const adminPasswordHash = await hashPassword(adminPassword);
  const userPasswordHash = await hashPassword(userPassword);

  for (const u of usersData) {
    await seedUser(u, u.role === "admin" ? adminPasswordHash : userPasswordHash);
  }

  const userId = "user-uuid-1";

  const members = [{ id: userId }];

  await prisma.room.createMany({ data: roomsData });

  const rooms = await prisma.room.findMany();
  const roomById = new Map(rooms.map((r) => [r.name, r]));

  await Promise.all(
    prices.map(({ name, price }) =>
      prisma.bookingPrice.upsert({
        where: { roomId: roomById.get(name)!.id },
        create: { roomId: roomById.get(name)!.id, price },
        update: { price },
      })
    )
  );

  await prisma.bookingSession.createMany({ data: bookingSessionsData });

  const bookingSessions = await prisma.bookingSession.findMany();
  const fullRoom = roomById.get("Aula Besar")!;
  const pagiSession = bookingSessions.find((s) => s.name === "Pagi")!;
  const bookingDate = new Date("2026-08-10T00:00:00.000Z");

  await prisma.booking.createMany({
    data: [
      ...members.map((user) => ({
        roomId: fullRoom.id,
        sessionId: pagiSession.id,
        userId: user.id,
        date: bookingDate,
        status: BookingStatus.APPROVED,
        decidedById: "admin-uuid-1",
      })),
      {
        roomId: roomById.get("Ruang Rapat 1")!.id,
        sessionId: pagiSession.id,
        userId: members[0].id,
        date: bookingDate,
        status: BookingStatus.APPROVED,
        decidedById: "admin-uuid-1",
      },
      {
        roomId: roomById.get("Ruang Diskusi")!.id,
        sessionId: bookingSessions.find((s) => s.name === "Siang")!.id,
        userId: members[0].id,
        date: bookingDate,
        status: BookingStatus.REJECTED,
        decidedById: "admin-uuid-1",
      },
    ],
  });

  const users = await prisma.user.findMany();
  console.log(
    `Seeded: ${users.length} users, ${rooms.length} rooms, ${bookingSessions.length} booking sessions, ` +
      `Aula Besar fully booked (${members.length} bookings) on ${bookingDate.toISOString().slice(0, 10)}`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
