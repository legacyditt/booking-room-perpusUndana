import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
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
  },

  trustedOrigins: [
    "http://localhost:3001",
    process.env.BACKEND_URL ?? "http://localhost:3001",
  ],

  secret: process.env.BETTER_AUTH_SECRET,

  plugins: [nextCookies()],
});

export type Auth = typeof auth;
