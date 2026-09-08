import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";
import { sendPasswordResetEmail } from "./mailer.js";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ??
    "https://booking-room-perpus-undana-api.vercel.app",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      status: { type: "string", required: true },
      idNumber: { type: "string", required: true },
      whatsapp: { type: "string", required: true },
      affiliation: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "user" },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url);
    },
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://booking-room-perpus-undana.vercel.app",
    process.env.FRONTEND_URL ?? "http://localhost:3000",
  ],

  secret: process.env.BETTER_AUTH_SECRET,
});

export type Auth = typeof auth;
