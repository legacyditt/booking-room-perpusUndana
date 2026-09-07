import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/api/auth-client";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session) {
    redirect("/login");
  }

  return children;
}
