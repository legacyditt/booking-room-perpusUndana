import { Metadata } from "next";
import { isBefore, parseISO, startOfDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReservationCard } from "@/features/reservations/components/ReservationCard";
import { mockBookings, mockSessions as librarySessions, mockRooms } from "@/data/mock";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";

export const metadata: Metadata = {
  title: "Pemesanan Saya | Booking Room Perpustakaan",
  description: "Kelola riwayat pemesanan ruangan perpustakaan Anda.",
};

export default function MyReservationsPage() {
  const today = startOfDay(new Date());

  const upcomingBookings = mockBookings.filter((booking) => {
    return !isBefore(booking.date, today); // Hari ini dan masa depan
  });

  const pastBookings = mockBookings.filter((booking) => {
    return isBefore(booking.date, today); // Kemarin dan masa lalu
  });

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

          {/* Tabs Area */}
          <Tabs defaultValue="upcoming" className="w-full">
            {/* Bagian List Tab (Garis) */}
            <TabsList
              variant="line"
              className="mb-8 w-full justify-start border-b border-border/40 pb-0 gap-8"
            >
              <TabsTrigger
                value="upcoming"
                className="text-sm font-bold uppercase tracking-wider pb-3 px-1"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="text-sm font-bold uppercase tracking-wider pb-3 px-1"
              >
                Past
              </TabsTrigger>
            </TabsList>

            {/* Konten Upcoming */}
            <TabsContent value="upcoming" className="mt-0">
              {upcomingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {upcomingBookings.map((booking) => {
                    const room = mockRooms.find((r) => r.id === booking.roomId);
                    const session = librarySessions.find(
                      (s) => s.id === booking.sessionId,
                    );

                    if (!room || !session) return null;

                    return (
                      <ReservationCard
                        key={booking.id}
                        booking={booking}
                        room={room}
                        session={session}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-neutral/50 font-medium border-2 border-dashed border-border rounded-xl">
                  Belum ada pemesanan yang akan datang.
                </div>
              )}
            </TabsContent>

            {/* Konten Past */}
            <TabsContent value="past" className="mt-0">
              {pastBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {pastBookings.map((booking) => {
                    const room = mockRooms.find((r) => r.id === booking.roomId);
                    const session = librarySessions.find(
                      (s) => s.id === booking.sessionId,
                    );
                    if (!room || !session) return null;
                    return (
                      <ReservationCard
                        key={booking.id}
                        booking={booking}
                        room={room}
                        session={session}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-neutral/50 font-medium border-2 border-dashed border-border rounded-xl">
                  Riwayat pemesanan kosong.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
