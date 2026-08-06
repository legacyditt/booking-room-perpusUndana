"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MagnifyingGlass, List, X } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container mx-auto max-w-7xl flex h-16 sm:h-20 items-center justify-between px-4 md:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          {/* Logo Undana */}
          <div className="relative w-17 h-17 sm:w-17 sm:h-17 shrink-0">
            <Image
              src="/images/logo-undana.png"
              alt="Logo Universitas Nusa Cendana"
              fill
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
          <div className="relative hidden sm:block">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-56 pl-9 bg-white border-border focus-visible:ring-primary shadow-sm"
            />
          </div>

          <Button
            variant="default"
            className="hidden sm:inline-flex px-8 shadow-sm"
          >
            Masuk
          </Button>

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
            <Button
              variant="default"
              className="w-full h-10 justify-center font-semibold text-sm shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
