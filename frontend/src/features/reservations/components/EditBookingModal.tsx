"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  CircleNotch,
} from "@phosphor-icons/react/dist/ssr";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { errorMessage } from "@/lib/api/errors";
import { useRoomAvailability } from "@/lib/hooks/use-room-availability";
import { useMonthAvailability } from "@/lib/hooks/use-month-availability";
import { useUpdateBooking } from "@/lib/hooks/use-update-booking";
import { Booking, Session } from "@/types/booking";
import { Room } from "@/types/room";

interface EditBookingModalProps {
  booking: Booking;
  room: Room;
  currentSession: Session | null;
  sessions: Session[];
}

export function EditBookingModal({
  booking,
  room,
  currentSession,
  sessions,
}: EditBookingModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(booking.date));
  const [selectedSession, setSelectedSession] = useState<string>(
    booking.sessionId ? booking.sessionId.toString() : "",
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState<Date | undefined>(
    new Date(booking.date),
  );

  const { data: monthAvailability = {} } = useMonthAvailability(
    room.id,
    booking.type === "ROOM" ? displayedMonth : undefined,
  );

  const isRoomBooking = booking.type === "ROOM";

  const dateString = date ? format(date, "yyyy-MM-dd") : "";
  const isSameAsCurrent =
    !!date &&
    dateString === booking.date.split("T")[0] &&
    (isRoomBooking || selectedSession === booking.sessionId?.toString());

  // Cek ketersediaan kursi secara realtime (hanya SEAT saat berbeda dari jadwal asli)
  const { data: availability, isFetching: isCheckingAvailability } =
    useRoomAvailability(
      room.id,
      isRoomBooking || isSameAsCurrent ? undefined : date,
      isRoomBooking || isSameAsCurrent ? undefined : selectedSession,
    );

  const updateMutation = useUpdateBooking();
  const isLoading = updateMutation.isPending;

  const handleUpdate = () => {
    if (!date) return;

    updateMutation.mutate(
      isRoomBooking
        ? { id: booking.id, date: dateString }
        : {
            id: booking.id,
            date: dateString,
            sessionId: Number(selectedSession),
          },
      {
        onSuccess: () => {
          toast.add({
            type: "success",
            title: "Pemesanan Diperbarui",
            description: `Jadwal untuk ${room.name} berhasil diubah.`,
          });
          setOpen(false);
        },
        onError: (error) => {
          toast.add({
            type: "error",
            title: "Pembaruan Gagal",
            description: errorMessage(
              error,
              "Terjadi kesalahan sistem saat memproses pembaruan. Silakan coba lagi.",
            ),
          });
        },
      },
    );
  };
  const isSaveDisabled =
    !date ||
    (isRoomBooking ? false : !selectedSession) ||
    isLoading ||
    (!isRoomBooking &&
      (isCheckingAvailability ||
        availability?.remainingCapacity === 0)) ||
    isSameAsCurrent;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isLoading) return;
        setOpen(next);
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="w-full font-bold border-border/80 text-primary min-h-[44px]"
          >
            Ubah
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif font-bold text-primary">
            Ubah Jadwal Pemesanan
          </DialogTitle>
          <DialogDescription>
            Pilih {isRoomBooking ? "tanggal baru" : "tanggal dan sesi baru"}{" "}
            untuk pemesanan{" "}
            <span className="font-semibold text-primary">{room.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Input Tanggal */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral uppercase tracking-wider">
              Pilih Tanggal Baru
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start text-left font-normal px-4 py-3 border-border shadow-sm",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-neutral shrink-0" />
                {date ? (
                  format(date, "PPPP", { locale: idLocale })
                ) : (
                  <span>Pilih Tanggal</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) setDate(d);
                    setIsCalendarOpen(false);
                  }}
                  onMonthChange={(month) => setDisplayedMonth(month)}
                  disabled={
                    isRoomBooking
                      ? (d) => {
                          const key = format(d, "yyyy-MM-dd");
                          const today = format(new Date(), "yyyy-MM-dd");
                          return (
                            key < today ||
                            monthAvailability[key]?.unavailable === true
                          );
                        }
                      : { before: new Date(new Date().setHours(0, 0, 0, 0)) }
                  }
                  locale={idLocale}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Input Sesi (hanya mode Reguler/SEAT) */}
          {!isRoomBooking && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-neutral uppercase tracking-wider">
                Pilih Sesi Baru
              </label>
              <Select
                value={selectedSession}
                onValueChange={(val) => setSelectedSession(val || "")}
              >
                <SelectTrigger className="w-full px-4 py-3 border-border shadow-sm">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <Clock className="h-5 w-5 text-neutral shrink-0" />
                    <span
                      className={!selectedSession ? "text-muted-foreground" : ""}
                    >
                      {selectedSession
                        ? (() => {
                            const s =
                              sessions.length > 0
                                ? sessions.find(
                                    (s) => s.id.toString() === selectedSession,
                                  )
                                : currentSession;
                            return s
                              ? `${s.name} (${s.startTime} - ${s.finishTime})`
                              : "Pilih Waktu Sesi";
                          })()
                        : "Pilih Waktu Sesi"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} ({s.startTime} - {s.finishTime})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Indikator Sisa Kursi (hanya mode Reguler/SEAT) */}
          {!isRoomBooking && !isSameAsCurrent && date && selectedSession && (
            <div className="mt-2 bg-neutral-50/50 rounded-lg p-3 border border-border/60 flex items-center justify-between">
              {isCheckingAvailability ? (
                <span className="text-sm font-medium text-neutral-500 animate-pulse w-full text-center">
                  Mengecek ketersediaan kursi...
                </span>
              ) : availability ? (
                <>
                  <span className="text-sm font-bold text-neutral">
                    Ketersediaan:
                  </span>
                  <Badge
                    variant={
                      availability.remainingCapacity > 0
                        ? "default"
                        : "destructive"
                    }
                    className="text-sm font-extrabold px-3 py-1 shadow-sm"
                  >
                    {availability.remainingCapacity > 0
                      ? `Tersedia ${availability.remainingCapacity} Kursi`
                      : "Penuh"}
                  </Badge>
                </>
              ) : null}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto font-medium"
          >
            Batal
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isSaveDisabled || isLoading}
            className="w-full sm:w-auto font-bold shadow-sm"
          >
            {isLoading ? (
              <>
                <CircleNotch className="w-4 h-4 animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
