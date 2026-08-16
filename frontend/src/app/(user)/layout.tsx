import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { client } from "@/lib/api/client";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await headers()).get("cookie");
  const res = await client.get("/api/auth/get-session", {
    headers: { cookie: cookie ?? "" },
  });
  const data = res.data;

  if (!data?.session) {
    redirect("/login");
  }

  return children;
}
