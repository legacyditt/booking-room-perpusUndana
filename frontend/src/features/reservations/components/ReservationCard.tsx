"use client";

import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarBlank, Clock, Users } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription,
  DialogFooter as ShadcnDialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Booking, Session } from "@/types/booking";
import { Room } from "@/types/room";

interface ReservationCardProps {
  booking: Booking;
  room: Room;
  session: Session;
}

// ── Pemetaan status booking ke variant Badge (Konsisten dengan Admin) ──
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusConfig: Record<
  Booking["status"],
  { label: string; variant: BadgeVariant }
> = {
  APPROVED: { label: "DIKONFIRMASI", variant: "default" },
  PENDING: { label: "MENUNGGU PERSETUJUAN", variant: "outline" },
  REJECTED: { label: "DITOLAK", variant: "destructive" },
  CANCELLED: { label: "DIBATALKAN", variant: "secondary" },
};

export function ReservationCard({
  booking,
  room,
  session,
}: ReservationCardProps) {
  // Format tanggal pembuatan
  const createdDate = parseISO(booking.createdAt);
  const createdText = isToday(createdDate)
    ? "Dibuat hari ini"
    : `Dibuat ${formatDistanceToNow(createdDate, { addSuffix: true, locale: idLocale })}`;

  // Format tanggal pemesanan
  const bookingDate = parseISO(booking.date);
  const formattedDate = format(bookingDate, "dd MMM yyyy", {
    locale: idLocale,
  });

  const currentStatus = statusConfig[booking.status] || {
    label: booking.status || "UNKNOWN",
    variant: "secondary",
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow border-border/80 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-6 pb-4 flex flex-col gap-6">
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
        <div className="flex flex-col gap-3 items-start">
          <div className="flex items-center gap-1.5 text-neutral/80 text-sm font-medium">
            <Users className="w-4 h-4" />
            <span>Maksimal {room.capacity} Orang</span>
          </div>
          <Badge
            variant={currentStatus.variant}
            className="font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full"
          >
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-end">
        {/* Date & Time Box */}
        <div className="bg-neutral/5 rounded-lg p-4 flex flex-col gap-3 border border-border/40">
          <div className="flex items-center gap-3 text-primary font-bold text-sm">
            <CalendarBlank className="w-4 h-4 text-neutral" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral text-sm font-medium">
            <Clock className="w-4 h-4 text-neutral" />
            <span>{session.startTime} - {session.finishTime}</span>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-6 pt-2 grid grid-cols-2 gap-3 border-t border-border/20 bg-neutral/5">
        {booking.status === "APPROVED" && (
          <>
            <Button
              variant="outline"
              className="w-full font-bold border-border/80 text-primary"
            >
              Ubah
            </Button>
            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Batalkan
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md">
                <ShadcnDialogHeader>
                  <ShadcnDialogTitle className="text-base text-primary font-bold">
                    Batalkan Peminjaman?
                  </ShadcnDialogTitle>
                  <DialogDescription className="text-sm">
                    Tindakan ini tidak dapat dikembalikan. Peminjaman Anda untuk{" "}
                    <span className="font-semibold">{room.name}</span> akan
                    dibatalkan secara permanen.
                  </DialogDescription>
                </ShadcnDialogHeader>
                <ShadcnDialogFooter className="mt-4 gap-2">
                  <DialogClose
                    render={
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none font-medium"
                      >
                        Kembali
                      </Button>
                    }
                  />
                  <DialogClose
                    render={
                      <Button
                        variant="destructive"
                        className="flex-1 sm:flex-none font-bold shadow-sm"
                      >
                        Ya, Batalkan
                      </Button>
                    }
                  />
                </ShadcnDialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        {booking.status === "PENDING" && (
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full col-span-2 font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Batalkan Permintaan
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <ShadcnDialogHeader>
                <ShadcnDialogTitle className="text-base text-primary font-bold">
                  Batalkan Permintaan?
                </ShadcnDialogTitle>
                <DialogDescription className="text-sm">
                  Tindakan ini tidak dapat dikembalikan. Permintaan peminjaman
                  Anda untuk <span className="font-semibold">{room.name}</span>{" "}
                  akan dibatalkan.
                </DialogDescription>
              </ShadcnDialogHeader>
              <ShadcnDialogFooter className="mt-4 gap-2">
                <DialogClose
                  render={
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none font-medium"
                    >
                      Kembali
                    </Button>
                  }
                />
                <DialogClose
                  render={
                    <Button
                      variant="destructive"
                      className="flex-1 sm:flex-none font-bold shadow-sm"
                    >
                      Ya, Batalkan
                    </Button>
                  }
                />
              </ShadcnDialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
