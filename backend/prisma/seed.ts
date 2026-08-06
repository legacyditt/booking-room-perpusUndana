import prisma from "../src/lib/prisma";
import { hash } from "bcryptjs";
import { Role, BookingStatus } from "../src/generated/prisma/enums";

const userPassword = "password123";

const roomsData = [
  { name: "Aula Besar", capacity: 10, imageUrl: "/rooms/aula-besar.jpg" },
  { name: "Ruang Rapat 1", capacity: 6, imageUrl: "/rooms/ruang-rapat-1.jpg" },
  { name: "Ruang Rapat 2", capacity: 4, imageUrl: "/rooms/ruang-rapat-2.jpg" },
  { name: "Ruang Diskusi", capacity: 8, imageUrl: "/rooms/ruang-diskusi.jpg" },
];

const prices = [
  { name: "Aula Besar", price: 500000 },
  { name: "Ruang Rapat 1", price: 300000 },
  { name: "Ruang Rapat 2", price: 250000 },
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
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash(userPassword, 10);

  await prisma.user.createMany({
    data: [
      { name: "Admin", email: "admin@perpus.test", password: passwordHash, role: Role.ADMIN },
      ...Array.from({ length: 9 }, (_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@perpus.test`,
        password: passwordHash,
        role: Role.USER as const,
      })),
    ],
  });

  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  const admin = users.find((u) => u.role === Role.ADMIN) ?? users[0];
  const members = users.filter((u) => u.id !== admin.id);

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

  await prisma.session.createMany({ data: sessionsData });

  const sessions = await prisma.session.findMany();
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
        userId: members[1].id,
        date: bookingDate,
        status: BookingStatus.REJECTED,
      },
    ],
  });

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
