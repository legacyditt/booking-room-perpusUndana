import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { hashPassword } from "@better-auth/utils/password";
import { prisma } from "@/lib/prisma";

const hashResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token dan kata sandi baru wajib diisi" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Kata sandi harus terdiri dari minimal 8 karakter" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashResetToken(token),
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token tidak valid atau telah kedaluwarsa" },
        { status: 400 },
      );
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

    return NextResponse.json({
      message: "Kata sandi berhasil diubah, silakan masuk kembali.",
    });
  } catch (error) {
    console.error("[auth] resetPassword error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
