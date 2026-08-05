import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllBookingPrices = async (req: Request, res: Response) => {
    try {
        const bookingPrices = await prisma.bookingPrice.findMany({
            include: {
                room: true
            }
        });
        return res.status(200).json({ data: bookingPrices });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getBookingPriceByRoom = async (req: Request, res: Response) => {
    try {
        const {roomId} = req.params
        const bookingPrice = await prisma.bookingPrice.findUnique({
            where: {roomId: Number(roomId)},
            include: {
                room: true
            }
        })
        if (!bookingPrice) {
            return res.status(404).json({ message: 'Booking price not found' });
        }
        return res.status(200).json({ data: bookingPrice });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const createBookingPrice = async (req: Request, res: Response) => {
    try {
        const { roomId, price} = req.body;
        const room = await prisma.room.findUnique({where: {id: Number(roomId)}});
        if (!room) {
            return res.status(404).json({message: 'Room Not Found'})
        }
        const existingPrice = await prisma.bookingPrice.findUnique({where: {roomId: Number(roomId)}})
        if (existingPrice) {
            return res.status(400).json({message: 'Booking price for this room already exists'})
        }
        const bookingPrice = await prisma.bookingPrice.create({
            data: {
                roomId: Number(roomId),
                price: Number(price)
            }
        });
        return res.status(201).json({ data: bookingPrice });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updateBookingPrice = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const { price } = req.body;

        const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
        if (!room) {
            return res.status(404).json({ message: 'Room Not Found' });
        }

        const bookingPrice = await prisma.bookingPrice.update({
            where: { roomId: Number(roomId) },
            data: {
                price: Number(price)
            }
        });

        return res.status(200).json({ data: bookingPrice });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteBookingPrice = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
        if (!room) {
            return res.status(404).json({ message: 'Room Not Found' });
        }

        const bookingPrice = await prisma.bookingPrice.delete({
            where: { roomId: Number(roomId) }
        });

        return res.status(200).json({ data: bookingPrice });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}