import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-3xl font-bold text-primary italic">
            Booking Room Perpustakaan Undana
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-primary border-b-2 border-primary font-bold pb-1"
          >
            Cari Ruangan
          </Link>
          <Link
            href="/bookings"
            className="text-neutral hover:text-primary transition-colors"
          >
            Pemesanan Saya
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-56 pl-9 bg-white border-border focus-visible:ring-primary shadow-sm"
            />
          </div>
          <Button variant="default" className="px-8 shadow-sm">
            Masuk
          </Button>
        </div>
      </div>
    </header>
  );
}
