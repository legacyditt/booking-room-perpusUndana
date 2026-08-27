import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/features/admin/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
