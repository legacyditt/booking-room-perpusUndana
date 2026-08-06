import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-tertiary/50 py-10 md:py-8 mt-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-6 text-sm text-neutral">
          
          <div className="text-center lg:text-left font-serif text-base max-w-sm">
            <p className="leading-relaxed">
              &copy; {new Date().getFullYear()} Layanan Perpustakaan Universitas. Melestarikan Pengetahuan, Memungkinkan Penemuan.
            </p>
          </div>

          <nav className="flex flex-col sm:flex-row flex-wrap justify-center gap-x-8 gap-y-2 font-medium w-full lg:w-auto text-center">
            <Link href="#" className="hover:text-primary hover:underline underline-offset-4 py-2.5 sm:py-1 transition-all">Syarat Penggunaan</Link>
            <Link href="#" className="hover:text-primary hover:underline underline-offset-4 py-2.5 sm:py-1 transition-all">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary hover:underline underline-offset-4 py-2.5 sm:py-1 transition-all">Aksesibilitas</Link>
            <Link href="#" className="hover:text-primary hover:underline underline-offset-4 py-2.5 sm:py-1 transition-all">Hubungi Pustakawan</Link>
            <Link href="#" className="hover:text-primary hover:underline underline-offset-4 py-2.5 sm:py-1 transition-all">Peta Perpustakaan</Link>
          </nav>
          
        </div>
      </div>
    </footer>
  );
}
