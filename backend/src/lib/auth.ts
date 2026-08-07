import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma"; 

export const auth = betterAuth({
  // 1. Adapter Database
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // 2. Modul Autentikasi
  emailAndPassword: {
    enabled: true, // Nyalakan fitur login pakai email & password
  },

  // 3. Keamanan: Izinkan Frontend mengakses (CORS cookies)
  trustedOrigins: [
    "http://localhost:3000",
    process.env.FRONTEND_URL ?? "http://localhost:3000",
  ],

  // 4. Secret Key untuk mengenkripsi token cookie
  secret: process.env.BETTER_AUTH_SECRET,
});

export type Auth = typeof auth;
