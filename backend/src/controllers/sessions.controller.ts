import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { logActivity } from "../lib/activityLog";

export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await prisma.bookingSession.findMany({
            orderBy: { startTime: "asc" },
            include: {
                createdBy: { select: { name: true } },
                updatedBy: { select: { name: true } },
            },
        });
        return res.status(200).json({ data: sessions });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSessionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const session = await prisma.bookingSession.findUnique({
            where: { id: Number(id) },
            include: {
                createdBy: { select: { name: true } },
                updatedBy: { select: { name: true } },
            },
        });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        return res.status(200).json({ data: session });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createSession = async (req: Request, res: Response) => {
    try {
        const { name, startTime, finishTime, isSewaOnly } = req.body;
        const session = await prisma.bookingSession.create({
            data: {
                name,
                startTime,
                finishTime,
                isRentOnly: isSewaOnly ?? false,
                createdById: req.userId,
            }
        });
        await logActivity(req.userId as string, "CREATE_SESSION", `Sesi: ${session.name}`);
        return res.status(201).json({ message: "Session created successfully", data: session });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, startTime, finishTime, isSewaOnly } = req.body;

        const existingSession = await prisma.bookingSession.findUnique({ where: { id: Number(id) } });
        if (!existingSession) return res.status(404).json({ message: 'Session not found' });

        const session = await prisma.bookingSession.update({
            where: { id: Number(id) },
            data: {
                name,
                startTime,
                finishTime,
                isRentOnly: isSewaOnly ?? existingSession.isRentOnly,
                updatedById: req.userId,
            }
        });
        await logActivity(req.userId as string, "UPDATE_SESSION", `Sesi: ${session.name}`);
        return res.status(200).json({ message: "Session updated successfully", data: session });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const session = await prisma.bookingSession.delete({ where: { id: Number(id) } }); // Berubah
        await logActivity(req.userId as string, "DELETE_SESSION", `Sesi: ${session.name}`);
        return res.status(200).json({ message: "Session deleted successfully", data: session });
    } catch (error) {
        if ((error as { code?: string }).code === "P2003") {
            return res.status(409).json({ message: "Sesi tidak dapat dihapus karena masih memiliki data booking." });
        }
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
