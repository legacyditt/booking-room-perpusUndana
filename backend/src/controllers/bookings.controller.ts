import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.userId },
            include: {
                room: {
                    include: { bookingPrice: true }
                },
                session: true
            },
            orderBy: { createdAt: "desc" }
        })

        return res.status(200).json({
            message: 'Bookings fetched successfully',
        data: bookings
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                room: {
                    include: { bookingPrice: true }
                },
                session: true,
                user: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        return res.status(200).json({ data: bookings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const bookingId = Number(id)

        if (Number.isNaN(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking id' })
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                room: {
                    include: { bookingPrice: true }
                },
                session: true
            }
        })

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        return res.status(200).json({ data: booking })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { roomId, sessionId, date } = req.body
        if (!req.userId) return res.status(401).json({ message: 'Unauthorized' })

        const room = await prisma.room.findUnique({
            where: { id: Number(roomId) },
            include: { bookingPrice: true }
        })
        if (!room) return res.status(404).json({ message: 'Room Not Found' })

        const session = await prisma.bookingSession.findUnique({ where: { id: Number(sessionId) } })
        if (!session) return res.status(404).json({ message: 'Session Not Found' })

        // Hanya ruangan premium yang butuh persetujuan admin.
        // Ruangan reguler langsung disetujui.
        const needsApproval = room.bookingPrice != null;

        let booking;
        try {
            const [bookedCount, newBooking] = await prisma.$transaction(async (tx) => {
                const count = await tx.booking.count({
                    where: {
                        roomId: Number(roomId),
                        sessionId: Number(sessionId),
                        date: new Date(date),
                        status: {
                            in: ['PENDING', 'APPROVED']
                        }
                    }
                })
                
                if (count >= room.capacity) {
                    throw new Error('CAPACITY_FULL')
                }
                
                const b = await tx.booking.create({
                    data: {
                        roomId: Number(roomId),
                        sessionId: Number(sessionId),
                        userId: req.userId as string,
                        date: new Date(date),
                        status: needsApproval ? 'PENDING' : 'APPROVED'
                    },
                    include: {
                        room: {
                            include: { bookingPrice: true }
                        },
                        session: true
                    }
                })
                return [count, b];
            });
            booking = newBooking;
        } catch (e: any) {
            if (e.message === 'CAPACITY_FULL') {
                return res.status(400).json({ message: 'Conflict: Room is fully booked for this session' })
            }
            throw e; // Akan ditangkap oleh catch(error) 
        }

        return res.status(201).json({
            message: 'Booking created successfully',
            data: booking
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        if (!req.userId) return res.status(401).json({ message: 'Unauthorized' })

        const booking = await prisma.booking.findUnique({
            where: { id: Number(req.params.id) }
        })
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }
        if (booking.userId !== req.userId) {
            return res.status(403).json({ message: 'Forbidden: not your booking' })
        }
        if (booking.status !== 'PENDING' && booking.status !== 'APPROVED') {
            return res.status(400).json({ message: 'Only pending or approved bookings can be cancelled' })
        }

        const cancelled = await prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'CANCELLED' },
            include: {
                room: { include: { bookingPrice: true } },
                session: true
            }
        })

        return res.status(200).json({ message: 'Booking cancelled successfully', data: cancelled })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const validStatuses = ['APPROVED', 'REJECTED', 'CANCELLED']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be APPROVED, REJECTED, or CANCELLED'
            })
        }

        const existingBooking = await prisma.booking.findUnique({
            where: { id: Number(id) }
        })
        if (!existingBooking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        const booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status },
            include: {
                room: true,
                session: true
            }
        })

        return res.status(200).json({
            message: `Booking ${status.toLowerCase()} successfully`,
            data: booking
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const existingBooking = await prisma.booking.findUnique({
            where: { id: Number(id) }
        })
        if (!existingBooking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        if (existingBooking.status !== 'PENDING') {
            return res.status(400).json({
                message: 'Only pending bookings can be cancelled'
            })
        }

        await prisma.booking.delete({
            where: { id: Number(id) }
        })

        return res.status(200).json({
            message: 'Booking cancelled successfully'
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}
