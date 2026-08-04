import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const session = await prisma.session.findMany()

        return res.status(200).json({ data: session });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getSessionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const session = await prisma.session.findUnique({ where: { id: Number(id) } })
        if (!session) {
            return res.status(404).json({ message: 'Session Not Found' })
        }
        return res.status(200).json({ data: session })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const createSession = async (req: Request, res: Response) => {
    try {
        const { name, startTime, finishTime } = req.body

        const session = await prisma.session.create({
            data: {
                name,
                startTime,
                finishTime
            }
        })
        return res.status(200).json({ data: session })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const updateSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, startTime, finishTime } = req.body

        const existingSession = await prisma.session.findUnique({ where: { id: Number(id) } })
        if (!existingSession) { return res.status(404).json({ message: 'Session Not Found' }) }

        const session = await prisma.session.update({
            where: { id: Number(id) },
            data: {
                name,
                startTime,
                finishTime
            }
        })
        return res.status(200).json({ data: session })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ meessage: 'Internal Server Error' })
    }
}

export const deleteSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const session = await prisma.session.findUnique({ where: { id: Number(id) } })
        if (!session) { return res.status(404).json({ message: 'Session Not Found' }) }
        return res.status(200).json({ data: session });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

