import { Request, Response } from "express";
import prisma from '../lib/prisma';

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany()
        return res.status(200).json({ data: rooms })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const room = await prisma.room.findUnique({ where: { id: Number(id) } })
        if (!room) return res.status(404).json({ message: 'Room not found' })
        return res.status(200).json({ data: room })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, capacity, isAvailable, isPerSeat } = req.body
        const room = await prisma.room.create({
            data: {
                name,
                capacity,
                isAvailable: isAvailable ?? true,
                isPerSeat: isPerSeat ?? false,
            }
        })
        return res.status(201).json({ messsage: "Room Created Successfully", data: room })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateRooms = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, capacity, isAvailable, isPerSeat } = req.body

        const existingRoom = await prisma.room.findUnique({
            where: { id: Number(id) }
        })
        if (!existingRoom) return res.status(404).json({ message: 'Room Not Found' })

        const room = await prisma.room.update({
            where: { id: Number(id) },
            data: {
                name,
                capacity,
                isAvailable,
                isPerSeat
            }
        })
        return res.status(200).json({ message: "Room Updated Successfully", data: room })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const room = await prisma.room.delete({ where: { id: Number(id) } })
        if (!room) return res.status(404).json({ message: 'Room not found' })
        return res.status(200).json({ message: "Room Deleted Successfully", data: room })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}