import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const sessions = await prisma.bookingSession.findMany(); // Berubah
        return res.status(200).json({ data: sessions });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSessionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const session = await prisma.bookingSession.findUnique({ where: { id: Number(id) } }); // Berubah
        if (!session) return res.status(404).json({ message: 'Session not found' });
        return res.status(200).json({ data: session });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createSession = async (req: Request, res: Response) => {
    try {
        const { name, startTime, finishTime } = req.body;
        const session = await prisma.bookingSession.create({ // Berubah
            data: {
                name,
                startTime,
                finishTime,
            }
        });
        return res.status(201).json({ message: "Session created successfully", data: session });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, startTime, finishTime } = req.body;

        const existingSession = await prisma.bookingSession.findUnique({ where: { id: Number(id) } }); // Berubah
        if (!existingSession) return res.status(404).json({ message: 'Session not found' });

        const session = await prisma.bookingSession.update({ // Berubah
            where: { id: Number(id) },
            data: {
                name,
                startTime,
                finishTime,
            }
        });
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
        return res.status(200).json({ message: "Session deleted successfully", data: session });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
