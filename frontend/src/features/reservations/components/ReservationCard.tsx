"use client";

import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale"; // Menggunakan locale Bahasa Indonesia
import { CalendarBlank, Clock, Users } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Booking, Session } from "@/types/booking";
import { Room } from "@/types/room";

interface ReservationCardProps {
  booking: Booking;
  room: Room;
  session: Session;
}

export function ReservationCard({ booking, room, session }: ReservationCardProps) {
  // Format tanggal pembuatan
  const createdDate = parseISO(booking.createdAt);
  const createdText = isToday(createdDate) 
    ? "Dibuat hari ini" 
    : `Dibuat ${formatDistanceToNow(createdDate, { addSuffix: true, locale: idLocale })}`;

  // Format tanggal pemesanan (contoh: "24 Okt 2024")
  const bookingDate = parseISO(booking.date);
  const formattedDate = format(bookingDate, "dd MMM yyyy", { locale: idLocale });

  // Styling logika status
  const isConfirmed = booking.status === "Confirmed";
  const badgeText = isConfirmed ? "DIKONFIRMASI" : "MENUNGGU PERSETUJUAN";
  
  return (
    <div className="bg-white border border-border/80 rounded-xl p-6 shadow-sm flex flex-col gap-6 text-left hover:shadow-md transition-shadow h-full">
      
      {/* Top Header Row (Badge & Waktu Dibuat) */}
      <div className="flex justify-between items-start gap-4">
        <span className="bg-neutral/10 text-neutral font-bold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full">
          {badgeText}
        </span>
        
        <span className="text-xs font-medium text-neutral/70">
          {createdText}
        </span>
      </div>

      {/* Main Room Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-serif font-bold text-primary">
          {room.name}
        </h3>
        <div className="flex items-center gap-2 text-neutral/80 text-sm">
          <Users className="w-4 h-4" />
          <span>Kapasitas: Maksimal {room.capacity} Orang</span>
        </div>
      </div>

      {/* Date & Time Box */}
      <div className="bg-neutral/5 rounded-lg p-4 flex flex-col gap-3 border border-border/40 mt-auto">
        <div className="flex items-center gap-3 text-primary font-bold text-sm">
          <CalendarBlank className="w-4 h-4 text-neutral" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3 text-neutral text-sm font-medium">
          <Clock className="w-4 h-4 text-neutral" />
          <span>{session.timeRange}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 grid grid-cols-2 gap-3">
        {isConfirmed ? (
          <>
            <Button variant="outline" className="w-full font-bold border-border/80 text-primary">
              Ubah
            </Button>
            <Button variant="outline" className="w-full font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              Batalkan
            </Button>
          </>
        ) : (
          <Button variant="outline" className="w-full col-span-2 font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            Batalkan Permintaan
          </Button>
        )}
      </div>

    </div>
  );
}
