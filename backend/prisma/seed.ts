import prisma from "../src/lib/prisma";
import { hashPassword } from "@better-auth/utils/password";
import { Role, BookingStatus } from "../src/generated/prisma/enums";

const userPassword = "password123";

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

const sessionsData = [
  { name: "Pagi", startTime: "08:00", finishTime: "12:00" },
  { name: "Siang", startTime: "12:00", finishTime: "16:00" },
  { name: "Sore", startTime: "16:00", finishTime: "20:00" },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.bookingPrice.deleteMany();
  await prisma.room.deleteMany();
  await prisma.bookingSession.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Menggunakan fungsi bawaan dari BetterAuth untuk hashing agar kompatibel
  const adminPasswordHash = await hashPassword("admin_PERPUSTAKAAN123");
  const userPasswordHash = await hashPassword("delano_MAHASISWA123");

  // 1. Create Admin
  const adminId = "admin-uuid-1";
  await prisma.user.create({
    data: {
      id: adminId,
      name: "Admin Perpustakaan",
      email: "adminperpus@gmail.com",
      role: "admin",
      status: "dosen",
      idNumber: "111122223333",
      whatsapp: "081234567890",
      accounts: {
        create: {
          id: "acc-admin-1",
          accountId: "adminperpus@gmail.com",
          providerId: "credential",
          password: adminPasswordHash,
        },
      },
    },
  });

  // 2. Create Regular User
  const userId = "user-uuid-1";
  await prisma.user.create({
    data: {
      id: userId,
      name: "Delano Manafe",
      email: "delanomanafe05@gmail.com",
      role: "user",
      status: "mahasiswa",
      idNumber: "220000001",
      whatsapp: "08120000001",
      accounts: {
        create: {
          id: "acc-user-1",
          accountId: "delanomanafe05@gmail.com",
          providerId: "credential",
          password: userPasswordHash,
        },
      },
    },
  });
  
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

  await prisma.bookingSession.createMany({ data: sessionsData });

  const sessions = await prisma.bookingSession.findMany();
  const fullRoom = roomById.get("Aula Besar")!;
  const pagiSession = sessions.find((s) => s.name === "Pagi")!;
  const bookingDate = new Date("2026-08-10T00:00:00.000Z");

  await prisma.booking.createMany({
    data: [
      ...members.map((user) => ({
        roomId: fullRoom.id,
        sessionId: pagiSession.id,
        userId: user.id,
        date: bookingDate,
        status: BookingStatus.APPROVED,
      })),
      {
        roomId: roomById.get("Ruang Rapat 1")!.id,
        sessionId: pagiSession.id,
        userId: members[0].id,
        date: bookingDate,
        status: BookingStatus.PENDING,
      },
      {
        roomId: roomById.get("Ruang Diskusi")!.id,
        sessionId: sessions.find((s) => s.name === "Siang")!.id,
        userId: members[0].id,
        date: bookingDate,
        status: BookingStatus.REJECTED,
      },
    ],
  });

  const users = await prisma.user.findMany();
  console.log(
    `Seeded: ${users.length} users, ${rooms.length} rooms, ${sessions.length} sessions, ` +
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
