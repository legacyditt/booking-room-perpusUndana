import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { auth } from "../lib/auth";

const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
} as const;

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: userSelect,
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({ data: users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers as HeadersInit });
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (session.user.role !== "admin") {
            return res.status(403).json({ message: 'Forbidden: admin access required' });
        }

        const id = req.params.id as string;
        const { role } = req.body;

        if (role !== "user" && role !== "admin") {
            return res.status(400).json({ message: 'Role must be "user" or "admin"' });
        }
        if (session.user.id === id && role !== "admin") {
            return res.status(403).json({ message: 'Tidak dapat menurunkan peran diri sendiri' });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: userSelect,
        });
        return res.status(200).json({ message: "Role updated successfully", data: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
