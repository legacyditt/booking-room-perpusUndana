"use client";

import { format, formatDistanceToNow, isToday } from "date-fns";
import { id as idLocale } from "date-fns/locale"; // Menggunakan locale Bahasa Indonesia
import { CalendarBlank, Clock, Users } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Booking, Session } from "@/types/booking";
import { Room } from "@/types/room";

interface ReservationCardProps {
  booking: Booking;
  room: Room;
  session: Session;
}

export function ReservationCard({ booking, room, session }: ReservationCardProps) {
  // Format tanggal pembuatan
  const createdDate = booking.createdAt;
  const createdText = isToday(createdDate) 
    ? "Dibuat hari ini" 
    : `Dibuat ${formatDistanceToNow(createdDate, { addSuffix: true, locale: idLocale })}`;

  // Format tanggal pemesanan (contoh: "24 Okt 2024")
  const bookingDate = booking.date;
  const formattedDate = format(bookingDate, "dd MMM yyyy", { locale: idLocale });

  // Styling logika status
  const statusConfig: Record<Booking["status"], { text: string, className: string }> = {
    PENDING: { text: "MENUNGGU PERSETUJUAN", className: "bg-yellow-100 text-yellow-800" },
    APPROVED: { text: "DIKONFIRMASI", className: "bg-green-100 text-green-800" },
    REJECTED: { text: "DITOLAK", className: "bg-red-100 text-red-800" },
    CANCELLED: { text: "DIBATALKAN", className: "bg-gray-100 text-gray-800" },
  };
  const currentStatus = statusConfig[booking.status] || { text: booking.status || "UNKNOWN", className: "bg-gray-100 text-gray-800" };
  
  return (
    <div className="bg-white border border-border/80 rounded-xl p-6 shadow-sm flex flex-col gap-6 text-left hover:shadow-md transition-shadow h-full">
      
      {/* Top Header Row (Judul & Waktu Dibuat) */}
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-2xl font-serif font-bold text-primary leading-tight">
          {room.name}
        </h3>
        <span className="text-[10px] font-bold text-neutral/50 uppercase tracking-wider text-right shrink-0 mt-1.5">
          {createdText}
        </span>
      </div>

      {/* Capacity & Status */}
      <div className="flex flex-col gap-2.5 items-start">
        <div className="flex items-center gap-1.5 text-neutral/80 text-sm font-medium">
          <Users className="w-4 h-4" />
          <span>Maksimal {room.capacity} Orang</span>
        </div>
        <span className={cn("font-bold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full", currentStatus.className)}>
          {currentStatus.text}
        </span>
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
        {booking.status === "APPROVED" && (
          <>
            <Button variant="outline" className="w-full font-bold border-border/80 text-primary">
              Ubah
            </Button>
            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="outline" className="w-full font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    Batalkan
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base text-primary font-bold">Batalkan Peminjaman?</DialogTitle>
                  <DialogDescription className="text-sm">
                    Tindakan ini tidak dapat dikembalikan. Peminjaman Anda untuk <span className="font-semibold">{room.name}</span> akan dibatalkan secara permanen.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2">
                  <DialogClose
                    render={
                      <Button variant="outline" className="flex-1 sm:flex-none font-medium">
                        Kembali
                      </Button>
                    }
                  />
                  <DialogClose
                    render={
                      <Button variant="destructive" className="flex-1 sm:flex-none font-bold shadow-sm">
                        Ya, Batalkan
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        {booking.status === "PENDING" && (
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline" className="w-full col-span-2 font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  Batalkan Permintaan
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-base text-primary font-bold">Batalkan Permintaan?</DialogTitle>
                <DialogDescription className="text-sm">
                  Tindakan ini tidak dapat dikembalikan. Permintaan peminjaman Anda untuk <span className="font-semibold">{room.name}</span> akan dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 gap-2">
                <DialogClose
                  render={
                    <Button variant="outline" className="flex-1 sm:flex-none font-medium">
                      Kembali
                    </Button>
                  }
                />
                <DialogClose
                  render={
                    <Button variant="destructive" className="flex-1 sm:flex-none font-bold shadow-sm">
                      Ya, Batalkan
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

    </div>
  );
}
