import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/features/admin/components/Sidebar";
import { client } from "@/lib/api/client";

export default async function AdminLayout({
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
  if (data.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar tetap di sisi kiri */}
      <Sidebar />
      
      {/* Konten Utama berada di sisi kanan */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
