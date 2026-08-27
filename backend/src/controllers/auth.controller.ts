import { Request, Response } from "express";
import { createHash, randomBytes } from "crypto";
// @ts-ignore: Module resolution for .d.mts in commonjs
import { hashPassword } from "@better-auth/utils/password";
import prisma from "../lib/prisma";
import { sendPasswordResetEmail } from "../lib/mailer";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 jam

// --- Helpers Domain (private) ---

const hashResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const generateAndSaveResetToken = async (userId: string) => {
  const token = randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: userId },
    data: {
      resetToken: hashResetToken(token),
      resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  return token;
};

const clearResetToken = (userId: string) =>
  prisma.user.update({
    where: { id: userId },
    data: { resetToken: null, resetTokenExpiry: null },
  });

// --- Controllers ---

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Selalu kembalikan pesan sukses agar alamat email tidak bisa "diintip" (anti user enumeration)
    if (!user) {
      return res.status(200).json({
        message: "Jika email terdaftar, tautan reset kata sandi telah dikirim.",
      });
    }

    const token = await generateAndSaveResetToken(user.id);
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, resetLink);
    } catch {
      // Jika email gagal terkirim, rollback token agar tidak ada token "zombie" di DB
      await clearResetToken(user.id);
      return res.status(500).json({
        message: "Gagal mengirim email. Silakan coba beberapa saat lagi.",
      });
    }

    return res.status(200).json({
      message: "Jika email terdaftar, tautan reset kata sandi telah dikirim.",
    });
  } catch (error) {
    console.error("[auth] forgotPassword error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token dan kata sandi baru wajib diisi" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Kata sandi harus terdiri dari minimal 8 karakter" });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashResetToken(token),
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token tidak valid atau telah kedaluwarsa" });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction([
      // 1. Perbarui hash kata sandi di akun credential BetterAuth
      prisma.account.updateMany({
        where: { userId: user.id, providerId: "credential" },
        data: { password: hashedPassword },
      }),
      // 2. Hapus semua sesi lama agar token login lama tidak bisa dipakai lagi
      prisma.session.deleteMany({ where: { userId: user.id } }),
      // 3. Bersihkan token reset agar tidak bisa dipakai ulang
      prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null },
      }),
    ]);

    return res
      .status(200)
      .json({ message: "Kata sandi berhasil diubah, silakan masuk kembali." });
  } catch (error) {
    console.error("[auth] resetPassword error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
