"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "@/lib/api/auth-client";
import { toast } from "@/components/ui/toast";
import {
  SquaresFour,
  CalendarBlank,
  Door,
  Clock,
  Users,
  SignOut,
  Shield,
} from "@phosphor-icons/react/dist/ssr";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { name: "Ringkasan", href: "/admin/overview", icon: SquaresFour },
  {
    name: "Kelola Pemesanan",
    href: "/admin/reservations",
    icon: CalendarBlank,
  },
  { name: "Kelola Ruangan", href: "/admin/rooms", icon: Door },
  { name: "Kelola Sesi", href: "/admin/sessions", icon: Clock },
  { name: "Kelola Pengguna", href: "/admin/users", icon: Users },
  { name: "Kelola Admin", href: "/admin/admins", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.add({
            type: "success",
            title: "Berhasil Keluar",
            description: "Anda telah berhasil keluar dari sistem.",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        },
      },
    });
  };

  return (
    <ShadcnSidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3.5">
          <Image
            src="/images/undana.png"
            alt="Logo Undana"
            width={42}
            height={42}
            priority
            className="object-contain shrink-0"
          />
          <div className="flex flex-col">
            <h1 className="font-serif text-base font-bold text-primary leading-tight">
              Booking Ruangan
            </h1>
            <p className="text-[11px] font-medium text-neutral-500 mt-0.5">
              Perpustakaan Undana
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      className={`px-4 py-5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-neutral-100 text-primary border-r-4 border-primary hover:bg-neutral-100"
                          : "hover:bg-neutral-50"
                      }`}
                    >
                      <Icon size={20} weight={isActive ? "fill" : "regular"} />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border bg-white">
        <div className="flex items-center gap-3 px-1 py-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden relative shrink-0 flex items-center justify-center text-lg font-bold text-neutral-500 uppercase">
            {session?.user?.name?.charAt(0) || "A"}
          </div>

          {/* Nama & Tombol Keluar */}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-primary truncate">
              {session?.user?.name || "Admin User"}
            </p>
            <button
              onClick={handleLogout}
              className="mt-1.5 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-xs font-medium text-neutral-500 hover:border-destructive hover:text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer"
            >
              <SignOut size={13} weight="bold" />
              Keluar
            </button>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
