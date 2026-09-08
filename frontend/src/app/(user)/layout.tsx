import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SessionData = {
  user: { id: string; name: string; email: string; role: string };
  session: { id: string; expiresAt: string };
};

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://booking-room-perpus-undana-api.vercel.app"
    : "http://localhost:3001");

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session: SessionData | null = null;

  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const res = await fetch(`${backendUrl}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      session = data?.session ? (data as SessionData) : null;
    }
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/login");
  }

  return children;
}
