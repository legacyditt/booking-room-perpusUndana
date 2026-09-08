import { headers } from "next/headers";
import { redirect } from "next/navigation";

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://booking-room-perpus-undana-api.vercel.app";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;

  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const res = await fetch(`${backendUrl}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      session = data?.session ?? null;
    }
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/login");
  }

  return children;
}
