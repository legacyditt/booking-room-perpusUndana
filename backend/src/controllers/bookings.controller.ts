import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import {
  sendBookingCancellationEmail,
  sendBookingStatusUpdateEmail,
} from "../lib/mailer";

// ROOM = sewa seluruh ruangan (blokir jika ada booking apa pun),
// SEAT = pesan 1 kursi (blokir jika sudah ada sewa ruangan atau kursi penuh).
const assertSlotAvailable = async (
  tx: Prisma.TransactionClient,
  input: { roomId: number; sessionId: number; date: Date; capacity: number },
  type: "SEAT" | "ROOM",
  excludeBookingId?: number,
) => {
  const existing = await tx.booking.findMany({
    where: {
      roomId: input.roomId,
      sessionId: input.sessionId,
      date: input.date,
      status: { in: ["PENDING", "APPROVED"] },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: { type: true },
  });

  const roomBlocked = existing.some((b) => b.type === "ROOM");
  const seatCount = existing.filter((b) => b.type === "SEAT").length;

  if (type === "ROOM") {
    if (existing.length > 0) throw new Error("CAPACITY_FULL");
  } else if (roomBlocked || seatCount >= input.capacity) {
    throw new Error("CAPACITY_FULL");
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId },
      include: {
        room: {
          include: { bookingPrice: true },
        },
        session: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: {
          include: { bookingPrice: true },
        },
        session: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ data: bookings });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookingId = Number(id);

    if (Number.isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: {
          include: { bookingPrice: true },
        },
        session: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ data: booking });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { roomId, sessionId, date, type = "SEAT" } = req.body;
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const bookingType: "SEAT" | "ROOM" = type === "ROOM" ? "ROOM" : "SEAT";

    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
    });
    if (!room) return res.status(404).json({ message: "Room Not Found" });

    const session = await prisma.bookingSession.findUnique({
      where: { id: Number(sessionId) },
    });
    if (!session) return res.status(404).json({ message: "Session Not Found" });

    // SEAT (reguler) langsung disetujui; ROOM (sewa) butuh persetujuan admin.
    const needsApproval = bookingType === "ROOM";

    let booking;
    try {
      await prisma.$transaction(async (tx) => {
        await assertSlotAvailable(
          tx,
          {
            roomId: Number(roomId),
            sessionId: Number(sessionId),
            date: new Date(date),
            capacity: room.capacity,
          },
          bookingType,
        );

        booking = await tx.booking.create({
          data: {
            roomId: Number(roomId),
            sessionId: Number(sessionId),
            userId: req.userId as string,
            date: new Date(date),
            status: needsApproval ? "PENDING" : "APPROVED",
            type: bookingType,
          },
          include: {
            room: {
              include: { bookingPrice: true },
            },
            session: true,
          },
        });
      });
    } catch (e: any) {
      if (e.message === "CAPACITY_FULL") {
        return res
          .status(400)
          .json({ message: "Conflict: Room is fully booked for this session" });
      }
      throw e; // Akan ditangkap oleh catch(error)
    }

    return res.status(201).json({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const booking = await prisma.booking.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: not your booking" });
    }
    if (booking.status !== "PENDING" && booking.status !== "APPROVED") {
      return res.status(400).json({
        message: "Only pending or approved bookings can be cancelled",
      });
    }

    const cancelled = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
      include: {
        room: { include: { bookingPrice: true } },
        session: true,
        user: true,
      },
    });

    // Kirim email notifikasi secara asynchronous
    if (cancelled.user?.email) {
      const dateStr = cancelled.date.toISOString().split("T")[0];
      const sessionStr = `${cancelled.session.startTime} - ${cancelled.session.finishTime}`;
      sendBookingCancellationEmail(
        cancelled.user.email,
        cancelled.user.name || "Pengguna",
        cancelled.room.name,
        dateStr,
        sessionStr,
      ).catch((err) => console.error(err));
    }

    return res
      .status(200)
      .json({ message: "Booking cancelled successfully", data: cancelled });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["APPROVED", "REJECTED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be APPROVED, REJECTED, or CANCELLED",
      });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        room: { include: { bookingPrice: true } },
        session: true,
        user: true,
      },
    });

    if (booking.user?.email) {
      sendBookingStatusUpdateEmail(
        booking.user.email,
        booking.user.name || "Pengguna",
        booking.room.name,
        status,
      ).catch((err) => console.error(err));
    }

    return res.status(200).json({
      message: `Booking ${status.toLowerCase()} successfully`,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingBooking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (existingBooking.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending bookings can be cancelled",
      });
    }

    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, sessionId } = req.body;

    if (!date || !sessionId) {
      return res
        .status(400)
        .json({ message: "Date and sessionId are required" });
    }

    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    // Cari data booking lama
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: { room: true },
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.userId !== req.userId)
      return res.status(403).json({ message: "Forbidden: not your booking" });
    if (booking.status !== "PENDING" && booking.status !== "APPROVED") {
      return res
        .status(400)
        .json({ message: "Only pending or approved bookings can be updated" });
    }

    const session = await prisma.bookingSession.findUnique({
      where: { id: Number(sessionId) },
    });
    if (!session) return res.status(404).json({ message: "Session Not Found" });

    const newDate = new Date(date);

    // Cek apakah user benar-benar mengubah sesuatu
    const isSameDate =
      booking.date.toISOString().split("T")[0] ===
      newDate.toISOString().split("T")[0];
    const isSameSession = booking.sessionId === Number(sessionId);

    if (isSameDate && isSameSession) {
      return res
        .status(200)
        .json({ message: "No changes made", data: booking });
    }

    let updatedBooking;
    try {
      // Gunakan Transaction untuk mencegah Race Condition saat cek kapasitas
      await prisma.$transaction(async (tx) => {
        await assertSlotAvailable(
          tx,
          {
            roomId: booking.roomId,
            sessionId: Number(sessionId),
            date: newDate,
            capacity: booking.room.capacity,
          },
          booking.type,
          booking.id,
        );

        updatedBooking = await tx.booking.update({
          where: { id: booking.id },
          data: {
            date: newDate,
            sessionId: Number(sessionId),
          },
          include: {
            room: { include: { bookingPrice: true } },
            session: true,
          },
        });
      });
    } catch (e: any) {
      if (e.message === "CAPACITY_FULL") {
        return res
          .status(400)
          .json({ message: "Conflict: Jadwal tersebut sudah penuh dipesan" });
      }
      throw e;
    }

    return res.status(200).json({
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
