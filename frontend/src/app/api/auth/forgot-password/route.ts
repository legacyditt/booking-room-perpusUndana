import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { hashPassword } from "@better-auth/utils/password";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 jam

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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Anti user enumeration: selalu kembalikan pesan sukses
    if (!user) {
      return NextResponse.json({
        message: "Jika email terdaftar, tautan reset kata sandi telah dikirim.",
      });
    }

    const token = await generateAndSaveResetToken(user.id);
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, resetLink);
    } catch {
      await clearResetToken(user.id);
      return NextResponse.json(
        {
          message:
            "Gagal mengirim email. Silakan coba beberapa saat lagi.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Jika email terdaftar, tautan reset kata sandi telah dikirim.",
    });
  } catch (error) {
    console.error("[auth] forgotPassword error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
