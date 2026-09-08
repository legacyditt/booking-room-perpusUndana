export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-tertiary/50 py-8 mt-12">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-center text-center">
          <p className="font-serif text-sm md:text-base text-neutral leading-relaxed max-w-2xl">
            &copy; {new Date().getFullYear()} Layanan Perpustakaan Universitas. Melestarikan Pengetahuan, Memungkinkan Penemuan.
          </p>
        </div>
      </div>
    </footer>
  );
}
