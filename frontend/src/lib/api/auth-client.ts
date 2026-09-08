import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // ponytail: no baseURL — proxy rewrite in next.config.ts routes /api/auth/* to backend.
  // This ensures session cookies are set on the frontend domain (same-origin),
  // so SSR can forward them via headers() in Server Components.
  plugins: [
    inferAdditionalFields({
      user: {
        status: { type: "string", required: true },
        idNumber: { type: "string", required: true },
        whatsapp: { type: "string", required: true },
        affiliation: { type: "string", required: false },
        role: { type: "string", required: false },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;

