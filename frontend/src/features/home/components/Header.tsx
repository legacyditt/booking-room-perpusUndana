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
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "@/lib/api/auth-client";

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
        <Link href="/" className="flex items-center shrink-0 gap-2 sm:gap-0">
          {/* Logo Undana */}
          <div className="flex relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
            <Image
              src="/images/undana.png"
              alt="Logo Universitas Nusa Cendana"
              width={45}
              height={45}
              priority
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
          {isPending ? (
            <Button
              disabled
              variant="outline"
              className="hidden sm:inline-flex px-8 shadow-sm"
            >
              Loading...
            </Button>
          ) : session ? (
            <div className="hidden sm:flex items-center gap-4">
              <div className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 h-9 shadow-sm">
                <UserCircle className="h-5 w-5" weight="fill" />
                <span className="font-semibold text-sm max-w-[120px] truncate">
                  {session.user.name?.split(" ")[0] ?? "User"}
                </span>
              </div>
              <div className="w-px h-6 bg-neutral/20" />
              <TooltipProvider delay={100}>
                <Tooltip>
                  <TooltipTrigger
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center w-9 h-9 bg-red-50 hover:bg-red-100 text-red-600 shadow-sm transition-colors"
                    aria-label="Logout"
                  >
                    <SignOut className="h-5 w-5" weight="bold" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={4} className="font-semibold text-xs px-2 py-1">
                    Logout
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
