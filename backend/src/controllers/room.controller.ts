import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { getRoomImageUrl, deleteRoomImage } from "../lib/storage";
import { logActivity } from "../lib/activityLog";

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

    const overlapping = bookings.filter((b) =>
      overlaps(
        session.startTime,
        session.finishTime,
        b.session.startTime,
        b.session.finishTime,
      ),
    );
    const roomBlocked = overlapping.some((b) => b.type === "ROOM");
    const seatCount = overlapping.filter((b) => b.type === "SEAT").length;
    const remainingCapacity = roomBlocked
      ? 0
      : Math.max(0, room.capacity - seatCount);

    return res.status(200).json({
      data: {
        remainingCapacity,
        capacity: room.capacity,
        booked: overlapping.length,
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

    // Tarik semua sesi yang ada di sistem
    const sessions = await prisma.bookingSession.findMany();

    // [SINGLE QUERY] Tarik SEMUA booking di tanggal tersebut untuk ruangan ini
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

    // Mapping ketersediaan untuk setiap sesi (berbasis overlap antar sesi)
    const availabilityMap: Record<string, any> = {};

    sessions.forEach((session) => {
      const overlapping = bookings.filter((b) =>
        overlaps(
          session.startTime,
          session.finishTime,
          b.session.startTime,
          b.session.finishTime,
        ),
      );
      const roomBlocked = overlapping.some((b) => b.type === "ROOM");
      const seatCount = overlapping.filter((b) => b.type === "SEAT").length;
      const remainingCapacity = roomBlocked
        ? 0
        : Math.max(0, room.capacity - seatCount);

      availabilityMap[session.id] = {
        remainingCapacity,
        capacity: room.capacity,
        booked: overlapping.length,
      };
    });

    return res.status(200).json({ data: availabilityMap });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, capacity, imageUrl } = req.body;
    const room = await prisma.room.create({
      data: {
        name,
        capacity,
        imageUrl,
        createdById: req.userId,
      },
    });
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
    const { name, capacity, imageUrl } = req.body;

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
