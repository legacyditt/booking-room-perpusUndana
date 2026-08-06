import { Metadata } from "next";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { ReservationClient } from "@/features/reservations/components/ReservationClient";
import { getUserBookings, DEFAULT_USER_ID } from "@/lib/api";

export const metadata: Metadata = {
  title: "Pemesanan Saya | Booking Room Perpustakaan",
  description: "Kelola riwayat pemesanan ruangan perpustakaan Anda.",
};

export const dynamic = "force-dynamic";

export default async function MyReservationsPage() {
  const bookings = await getUserBookings(DEFAULT_USER_ID);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
              Pemesanan Saya
            </h1>
            <p className="text-neutral/80 text-base md:text-lg">
              Tinjau dan kelola reservasi ruangan dan fasilitas perpustakaan
              Anda.
            </p>
          </div>

          {/* Client component for Tabs, Search, and Filtering */}
          <ReservationClient bookings={bookings} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
