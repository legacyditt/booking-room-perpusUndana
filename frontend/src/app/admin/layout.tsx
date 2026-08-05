import { Sidebar } from "@/features/admin/components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
