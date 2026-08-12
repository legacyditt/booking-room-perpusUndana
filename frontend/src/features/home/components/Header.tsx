"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MagnifyingGlass,
  List,
  X,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "@/lib/api/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const handleLogout = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          // 1. Tampilkan notifikasi
          toast.add({
            type: "success",
            title: "Berhasil Keluar",
            description: "Anda telah berhasil keluar dari sistem.",
          });

          // 2. Beri jeda 1 detik
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container mx-auto max-w-7xl flex h-16 sm:h-20 items-center justify-between px-4 md:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          {/* Logo Undana */}
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
            <Image
              src="/images/logo-undana.png"
              alt="Logo Universitas Nusa Cendana"
              fill
              priority
              sizes="(max-width: 640px) 48px, 64px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base sm:text-xl font-bold text-primary italic tracking-tight">
              Booking Ruangan
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              Perpustakaan UNDANA
            </span>
          </div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-primary border-b-2 border-primary font-bold pb-1"
                : "text-neutral hover:text-primary transition-colors"
            }
          >
            Cari Ruangan
          </Link>
          <Link
            href="/reservations"
            className={
              pathname?.startsWith("/reservations")
                ? "text-primary border-b-2 border-primary font-bold pb-1"
                : "text-neutral hover:text-primary transition-colors"
            }
          >
            Pemesanan Saya
          </Link>
        </nav>

        {/* Actions - Desktop Search/Login & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-56 pl-9 bg-white border-border focus-visible:ring-primary shadow-sm"
            />
          </div>

          {isPending ? (
            <Button
              disabled
              variant="outline"
              className="hidden sm:inline-flex px-8 shadow-sm"
            >
              Loading...
            </Button>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:inline-flex items-center justify-center gap-2 text-neutral hover:text-primary transition-colors hover:bg-muted/50 px-3 rounded-md h-10 focus:outline-none">
                <UserCircle className="h-6 w-6 text-primary" weight="fill" />
                <span className="font-medium text-sm max-w-[120px] truncate">
                  {session.user.name?.split(" ")[0] ?? "User"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border-border shadow-md rounded-md p-1"
              >
                <DropdownMenuItem
                  className="cursor-pointer rounded-sm hover:bg-muted p-2 text-sm font-medium"
                  onClick={() => {
                    window.location.href = "/profile";
                  }}
                >
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border my-1" />
                <DropdownMenuItem
                  className="cursor-pointer rounded-sm hover:bg-red-50 text-red-600 focus:text-red-600 focus:bg-red-50 p-2 text-sm font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="w-10 h-10" />
          )}

          {/* Mobile Hamburger Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden h-10 w-10 border-border text-primary"
            aria-label="Buka Menu Navigasi"
          >
            {isOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Bar */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 w-full bg-background border-b border-border shadow-lg p-4 flex flex-col gap-3 z-50">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={
                pathname === "/"
                  ? "flex items-center h-10 px-4 rounded-md bg-primary/10 text-primary font-bold text-sm"
                  : "flex items-center h-10 px-4 rounded-md text-neutral hover:bg-muted transition-colors font-medium text-sm"
              }
            >
              Cari Ruangan
            </Link>
            <Link
              href="/reservations"
              onClick={() => setIsOpen(false)}
              className={
                pathname?.startsWith("/reservations")
                  ? "flex items-center h-10 px-4 rounded-md bg-primary/10 text-primary font-bold text-sm"
                  : "flex items-center h-10 px-4 rounded-md text-neutral hover:bg-muted transition-colors font-medium text-sm"
              }
            >
              Pemesanan Saya
            </Link>
          </nav>

          <div className="pt-2 border-t border-border">
            {isPending ? (
              <Button
                disabled
                variant="outline"
                className="w-full h-10 justify-center font-semibold text-sm shadow-sm"
              >
                Loading...
              </Button>
            ) : session ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-muted/50 border border-border rounded-lg">
                  <UserCircle className="h-9 w-9 text-primary" weight="fill" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-sm text-foreground truncate">
                      {session.user.name?.split(" ")[0] ?? "User"}
                    </span>
                    <span className="text-xs text-neutral truncate">
                      {session.user.email}
                    </span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full block"
                >
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-center font-semibold text-sm shadow-sm border-border"
                  >
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="w-full h-10 justify-center font-semibold text-sm shadow-sm"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
