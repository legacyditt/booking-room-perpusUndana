"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  SquaresFour,
  CalendarBlank,
  Door,
  Clock,
  Users,
  Gear,
  SignOut,
} from "@phosphor-icons/react";

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
  { name: "Pengaturan Sistem", href: "/admin/settings", icon: Gear },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col min-h-screen">
      {/* Header / Logo Section */}
      <div className="p-8">
        <h1 className="font-serif text-3xl font-bold text-primary leading-tight">
          Library
          <br />
          Admin
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Booking Ruangan Perpustakaan Undana
        </p>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-neutral-100 text-primary border-r-4 border-primary"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-primary"
              }`}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center gap-3 px-3 py-2">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden relative shrink-0">
            <Image
              src="https://placehold.co/100x100/png"
              alt="Admin Profile"
              fill
              className="object-cover"
            />
          </div>

          {/* Nama & Tombol Keluar */}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-primary truncate">
              Admin User
            </p>
            <button className="mt-1.5 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-xs font-medium text-neutral-500 hover:border-destructive hover:text-destructive hover:bg-destructive/5 transition-all duration-200">
              <SignOut size={13} weight="bold" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
