import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  plugins: [
    inferAdditionalFields({
      user: {
        status: { type: "string", required: true },
        idNumber: { type: "string", required: true },
        whatsapp: { type: "string", required: true },
        affiliation: { type: "string", required: false },
        role: { type: "string", required: false },
      }
    })
  ]
});

export const { signIn, signUp, signOut, useSession } = authClient;
