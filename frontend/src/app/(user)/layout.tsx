import { headers } from "next/headers";
import { redirect } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_API_URL!;

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieHeader = (await headers()).get("cookie") ?? "";
  const res = await fetch(`${backendUrl}/api/auth/get-session`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  const { session } = await res.json();

  if (!session) {
    redirect("/login");
  }

  return children;
}
