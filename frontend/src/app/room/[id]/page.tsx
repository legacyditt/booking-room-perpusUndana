import { notFound } from "next/navigation";
import { Header } from "@/features/home/components/Header";
import { RoomImageGallery } from "@/features/booking/components/RoomImageGallery";
import { BookingDetailsForm } from "@/features/booking/components/BookingDetailsForm";
import { mockRooms } from "@/data/mockRooms";
import { librarySessions } from "@/data/mockBookings";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  // Await params untuk mendapatkan ID dari URL
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Cari data ruangan berdasarkan ID
  const room = mockRooms.find((r) => r.id === id);

  if (!room) {
    notFound(); // Otomatis render halaman jika ID tidak ada
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
          
          {/* Navigasi Kembali & Judul Halaman */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-bold text-neutral hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" weight="bold" />
              Kembali ke Pencarian Ruangan
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary">Detail Pemesanan</h1>
              <p className="text-neutral/80 mt-1 text-sm">Lengkapi formulir di bawah untuk mengonfirmasi pemesanan Anda.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
            {/* Bagian Kiri: Gambar Ruangan */}
            <RoomImageGallery room={room} />
            
            {/* Bagian Kanan: Form Pemesanan */}
            <div className="sticky top-28">
              <BookingDetailsForm room={room} sessions={librarySessions} />
            </div>
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm font-serif italic text-neutral">
            © 2026 Booking Room Perpustakaan Undana.
          </p>
        </div>
      </footer>
    </div>
  );
}
