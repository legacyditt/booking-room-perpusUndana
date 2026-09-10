import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { getRoomImageUrl, deleteRoomImage } from "../lib/storage.js";
import { logActivity } from "../lib/activityLog.js";

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        bookingPrice: true,
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
      },
    });
    const data = await Promise.all(
      rooms.map(async (room) => ({
        ...room,
        imageUrlDisplay: await getRoomImageUrl(room.imageUrl),
      })),
    );
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const toMin = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const overlaps = (
  aStart: string,
  aFinish: string,
  bStart: string,
  bFinish: string,
) => toMin(aStart) < toMin(bFinish) && toMin(bStart) < toMin(aFinish);

export const getRoomAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, sessionId } = req.query;

    if (!date || !sessionId) {
      return res
        .status(400)
        .json({ message: "Date and sessionId are required" });
    }

    const room = await prisma.room.findUnique({ where: { id: Number(id) } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const session = await prisma.bookingSession.findUnique({
      where: { id: Number(sessionId) },
      select: { startTime: true, finishTime: true },
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const bookings = await prisma.booking.findMany({
      where: {
        roomId: Number(id),
        date: new Date(date as string),
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
      select: {
        type: true,
        session: { select: { startTime: true, finishTime: true } },
      },
    });

    // ROOM (sewa) memblokir seluruh hari; SEAT dibatasi per sesi (overlap waktu).
    const roomBlocked = bookings.some((b) => b.type === "ROOM");
    const seatCount = bookings.filter(
      (b) =>
        b.type === "SEAT" &&
        b.session &&
        overlaps(
          session.startTime,
          session.finishTime,
          b.session.startTime,
          b.session.finishTime,
        ),
    ).length;
    const remainingCapacity = roomBlocked
      ? 0
      : Math.max(0, room.capacity - seatCount);

    return res.status(200).json({
      data: {
        remainingCapacity,
        capacity: room.capacity,
        booked: roomBlocked ? 1 : seatCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id: Number(id) },
      include: {
        bookingPrice: true,
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
      },
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    return res
      .status(200)
      .json({ data: { ...room, imageUrlDisplay: await getRoomImageUrl(room.imageUrl) } });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoomDailyAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const room = await prisma.room.findUnique({ where: { id: Number(id) } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const sessions = await prisma.bookingSession.findMany();

    const bookings = await prisma.booking.findMany({
      where: {
        roomId: Number(id),
        date: new Date(date as string),
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
      select: {
        type: true,
        session: { select: { startTime: true, finishTime: true } },
      },
    });

    const userBookings = req.userId
      ? await prisma.booking.findMany({
          where: {
            userId: req.userId,
            date: new Date(date as string),
            status: {
              in: ["PENDING", "APPROVED"],
            },
          },
          select: {
            type: true,
            sessionId: true,
            session: { select: { startTime: true, finishTime: true } },
          },
        })
      : [];

    const availabilityMap: Record<string, any> = {};

    sessions.forEach((session) => {
      const roomBlocked = bookings.some((b) => b.type === "ROOM");
      const seatCount = bookings.filter(
        (b) =>
          b.type === "SEAT" &&
          b.session &&
          overlaps(
            session.startTime,
            session.finishTime,
            b.session.startTime,
            b.session.finishTime,
          ),
      ).length;
      const remainingCapacity = roomBlocked
        ? 0
        : Math.max(0, room.capacity - seatCount);

      const userBooked = userBookings.some(
        (b) =>
          b.type === "ROOM" ||
          b.sessionId === session.id ||
          (b.session &&
            overlaps(
              session.startTime,
              session.finishTime,
              b.session.startTime,
              b.session.finishTime,
            )),
      );

      availabilityMap[session.id] = {
        remainingCapacity,
        capacity: room.capacity,
        booked: roomBlocked ? 1 : seatCount,
        userBooked,
      };
    });

    return res.status(200).json({ data: availabilityMap });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoomMonthAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { month } = req.query; // "yyyy-MM"

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const [yStr, mStr] = (month as string).split("-");
    const year = Number(yStr);
    const monthIdx = Number(mStr) - 1;
    if (
      Number.isNaN(year) ||
      Number.isNaN(monthIdx) ||
      monthIdx < 0 ||
      monthIdx > 11
    ) {
      return res.status(400).json({ message: "Month tidak valid" });
    }

    const room = await prisma.room.findUnique({ where: { id: Number(id) } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const setting = await prisma.systemSetting.findUnique({ where: { id: 1 } });
    const workingDays = setting
      ? setting.days.split(",")
      : ["senin", "selasa", "rabu", "kamis", "jumat"];

    // Rentang bulan (UTC) konsisten dengan penyimpanan `date` (UTC midnight).
    const start = new Date(Date.UTC(year, monthIdx, 1));
    const end = new Date(Date.UTC(year, monthIdx + 1, 1));

    const bookings = await prisma.booking.findMany({
      where: {
        roomId: Number(id),
        date: { gte: start, lt: end },
        status: { in: ["PENDING", "APPROVED"] },
      },
      select: { date: true },
    });
    const bookedSet = new Set(
      bookings.map((b) => b.date.toISOString().split("T")[0]),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    const data: Record<string, { workingDay: boolean; unavailable: boolean }> =
      {};
    const cur = new Date(start);
    while (cur < end) {
      const dateStr = cur.toISOString().split("T")[0];
      const dayName = cur
        .toLocaleDateString("id-ID", { weekday: "long", timeZone: "UTC" })
        .toLowerCase();
      const workingDay = workingDays.includes(dayName);
      data[dateStr] = {
        workingDay,
        unavailable: !workingDay || dateStr < todayStr || bookedSet.has(dateStr),
      };
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const syncRoomPrice = async (roomId: number, price: number) => {
  const existing = await prisma.bookingPrice.findUnique({ where: { roomId } });
  if (price > 0) {
    if (existing) {
      await prisma.bookingPrice.update({ where: { roomId }, data: { price } });
    } else {
      await prisma.bookingPrice.create({ data: { roomId, price } });
    }
  } else if (existing) {
    await prisma.bookingPrice.delete({ where: { roomId } });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, capacity, imageUrl, price } = req.body;
    const room = await prisma.room.create({
      data: {
        name,
        capacity,
        imageUrl,
        createdById: req.userId,
      },
    });
    if (price !== undefined && Number(price) > 0) {
      await prisma.bookingPrice.create({
        data: { roomId: room.id, price: Number(price) },
      });
    }
    await logActivity(req.userId as string, "CREATE_ROOM", `Ruang: ${room.name}`);
    return res
      .status(201)
      .json({ message: "Room Created Successfully", data: room });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRooms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, capacity, imageUrl, price } = req.body;

    const existingRoom = await prisma.room.findUnique({
      where: { id: Number(id) },
    });
    if (!existingRoom)
      return res.status(404).json({ message: "Room Not Found" });

    const room = await prisma.room.update({
      where: { id: Number(id) },
      data: {
        name,
        capacity,
        imageUrl,
        updatedById: req.userId,
      },
    });

    if (price !== undefined) {
      await syncRoomPrice(room.id, Number(price));
    }

    if (imageUrl !== existingRoom.imageUrl) {
      await deleteRoomImage(existingRoom.imageUrl);
    }

    await logActivity(req.userId as string, "UPDATE_ROOM", `Ruang: ${room.name}`);
    return res
      .status(200)
      .json({ message: "Room Updated Successfully", data: room });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.delete({ where: { id: Number(id) } });
    await deleteRoomImage(room.imageUrl);
    await logActivity(req.userId as string, "DELETE_ROOM", `Ruang: ${room.name}`);
    return res
      .status(200)
      .json({ message: "Room Deleted Successfully", data: room });
  } catch (error) {
    if ((error as { code?: string }).code === "P2003") {
      return res
        .status(409)
        .json({
          message:
            "Ruangan tidak dapat dihapus karena masih memiliki data booking.",
        });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
