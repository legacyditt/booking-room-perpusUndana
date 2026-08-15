import { Request, Response } from "express";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
} as const;

type AdminUser = Prisma.UserGetPayload<{ select: typeof userSelect }>;

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
        const id = req.params.id as string;
        const { role } = req.body;

        if (role !== "user" && role !== "admin") {
            return res.status(400).json({ message: 'Role must be "user" or "admin"' });
        }
        if (req.userId === id && role !== "admin") {
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

export const createAdmins = async (req: Request, res: Response) => {
    try {
        const emails: string[] = Array.isArray(req.body?.emails)
            ? req.body.emails
            : [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const uniqueEmails: string[] = [
            ...new Set(
                emails.map((email) => email.trim().toLowerCase()).filter((email) => emailRegex.test(email))
            ),
        ];

        if (uniqueEmails.length === 0) {
            return res.status(400).json({ message: "Email tidak valid atau kosong" });
        }

        const password = "admin123";
        const data: AdminUser[] = [];
        const failed: string[] = [];

        let adminNumber =
            (await prisma.user.count({ where: { role: "admin" } })) + 1;

        for (const email of uniqueEmails) {
            try {
                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing) {
                    if (existing.role !== "admin") {
                        const updated = await prisma.user.update({
                            where: { id: existing.id },
                            data: { role: "admin" },
                            select: userSelect,
                        });
                        data.push(updated);
                    }
                    continue;
                }

                const { user } = await auth.api.signUpEmail({
                    body: {
                        email,
                        password,
                        name: `Admin ${adminNumber++}`,
                        role: "admin",
                        status: "umum",
                        idNumber: "",
                        whatsapp: "",
                    },
                });
                data.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role ?? "admin",
                    status: user.status ?? "umum",
                    createdAt: user.createdAt,
                });
            } catch (error) {
                console.log(error);
                failed.push(email);
            }
        }

        return res.status(200).json({ data, failed });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
