import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/features/admin/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type SessionData = {
  user: { id: string; name: string; email: string; role: string };
  session: { id: string; expiresAt: string };
};

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://booking-room-perpus-undana-api.vercel.app"
    : "http://localhost:3001");

export default async function AdminLayout({
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
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider className="overflow-x-hidden">
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 min-w-0 bg-neutral-50 flex flex-col h-screen overflow-hidden">
        {/* Tombol trigger sidebar (Khusus muncul di mobile) */}
        <div className="p-4 md:hidden border-b border-border bg-white flex items-center gap-3 shrink-0">
          <SidebarTrigger />
          <span className="font-serif font-bold text-primary">
            Library Admin
          </span>
        </div>

        {/* Render halaman  */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </main>
    </SidebarProvider>
  );
}
