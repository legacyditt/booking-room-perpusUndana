import { notFound } from "next/navigation";
import { Header } from "@/features/home/components/Header";
import { RoomImageGallery } from "@/features/booking/components/RoomImageGallery";
import { BookingDetailsForm } from "@/features/booking/components/BookingDetailsForm";
import { getRoom, getSessions, getWorkingDays } from "@/lib/api";
import { getCookieHeader } from "@/lib/api/server";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function BookingPage({ params, searchParams }: PageProps) {
  // Await params untuk mendapatkan ID dari URL
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { mode = "reguler" } = await searchParams;

  let room;
  const cookie = (await getCookieHeader()).cookie;
  try {
    room = await getRoom(Number(id), cookie);
  } catch {
    notFound(); // Otomatis render halaman jika ID tidak ada
  }

  const sessions = await getSessions(cookie);

  let workingDays: string[] = ["senin", "selasa", "rabu", "kamis", "jumat"];
  try {
    workingDays = (await getWorkingDays(cookie)).days;
  } catch {
    // Fallback ke hari kerja default bila endpoint gagal.
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background pb-28 lg:pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
          
          {/* Navigasi Kembali */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-bold text-neutral hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" weight="bold" />
              Kembali ke Pencarian Ruangan
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-10 items-start">
            {/* Bagian Kiri: Gambar */}
            <RoomImageGallery room={room} />
            
            {/* Bagian Kanan: Form Pemesanan */}
            <div className="sticky top-28">
              <BookingDetailsForm room={room} sessions={sessions} workingDays={workingDays} mode={mode === "sewa" ? "sewa" : "reguler"} />
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
