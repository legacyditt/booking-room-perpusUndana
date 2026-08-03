import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-tertiary/50 py-8 mt-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral">
          
          <div className="text-center md:text-left font-serif text-base">
            <p>
              &copy; {new Date().getFullYear()} Layanan Perpustakaan Universitas. Melestarikan Pengetahuan, Memungkinkan Penemuan.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-medium">
            <Link href="#" className="hover:text-primary underline underline-offset-4">Syarat Penggunaan</Link>
            <Link href="#" className="hover:text-primary underline underline-offset-4">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary underline underline-offset-4">Aksesibilitas</Link>
            <Link href="#" className="hover:text-primary underline underline-offset-4">Hubungi Pustakawan</Link>
            <Link href="#" className="hover:text-primary underline underline-offset-4">Peta Perpustakaan</Link>
          </nav>
          
        </div>
      </div>
    </footer>
  );
}
