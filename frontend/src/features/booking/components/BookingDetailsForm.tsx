"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  Tag,
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
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Room } from "@/types/room";
import { Session } from "@/types/booking";
import { client } from "@/lib/api/client";
import { createBooking } from "@/lib/api/bookings";
import { errorMessage } from "@/lib/api/errors";

interface BookingDetailsFormProps {
  room: Room;
  sessions: Session[];
  mode?: "reguler" | "sewa";
}

export function BookingDetailsForm({
  room,
  sessions,
  mode = "reguler",
}: BookingDetailsFormProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for availability
  const [availability, setAvailability] = useState<{ remainingCapacity: number; capacity: number; booked: number } | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  const router = useRouter();

  const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const formatRupiah = (angka: number) => rupiahFormatter.format(angka);

  const bookingPrice = room.bookingPrice;
  const pricePerSessionMock = bookingPrice ? Number(bookingPrice.price) : 0;

  // Sewa = booking seluruh ruangan, bukan 1 kursi
  const isSewa = mode === "sewa";
  const isUnavailable = isSewa
    ? (availability?.booked ?? 0) > 0
    : availability?.remainingCapacity === 0;

  useEffect(() => {
    async function checkAvailability() {
      if (!date || !selectedSession) {
        setAvailability(null);
        return;
      }
      setIsCheckingAvailability(true);
      try {
        // Date manipulation to prevent timezone issues, passing ISO date format (YYYY-MM-DD)
        const dateString = format(date, 'yyyy-MM-dd');
        const response = await client.get(`/rooms/${room.id}/availability?date=${dateString}&sessionId=${selectedSession}`);
        if (response.data && response.data.data) {
          setAvailability(response.data.data);
        }
      } catch (error) {
        console.error("Failed to check availability:", error);
        setAvailability(null);
      } finally {
        setIsCheckingAvailability(false);
      }
    }
    
    checkAvailability();
  }, [date, selectedSession, room.id]);

  const handleBooking = async () => {
    if (!date || !selectedSession) return;
    setIsLoading(true);

    try {
      await createBooking({
        roomId: room.id,
        sessionId: Number(selectedSession),
        date: format(date, "yyyy-MM-dd"),
        type: isSewa ? "ROOM" : "SEAT",
      });

      toast.add({
        type: "success",
        title: "Pemesanan Berhasil",
        description: `Ruangan ${room.name} berhasil dipesan.`,
      });

      // Bersihkan state form
      setDate(undefined);
      setSelectedSession("");

      // Arahkan user ke halaman riwayat pemesanan
      router.push("/reservations");
    } catch (error) {
      toast.add({
        type: "error",
        title: "Pemesanan Gagal",
        description: errorMessage(
          error,
          "Terjadi kesalahan sistem saat memproses pemesanan Anda. Silakan coba lagi."
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6 bg-white border border-border/50 rounded-xl shadow-sm h-full">
      {/* Header Info & Capacity/Price */}
      <div className="border-b border-border pb-5 flex flex-col gap-3">
        <h1 className="text-3xl font-serif font-bold text-primary">
          {room.name}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-neutral/80">
            <Users className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium">
              Maksimal {room.capacity} Orang
            </span>
          </div>

          {/* Price Tag (Hanya untuk Sewa) */}
          {isSewa && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md w-fit">
              <Tag className="w-4 h-4" weight="bold" />
              <span className="text-sm font-bold tracking-wide">
                {formatRupiah(pricePerSessionMock)} / sesi
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Fields */}
      <div className="flex flex-col gap-4 flex-1">
        <h3 className="font-bold text-lg text-primary">Booking Details</h3>

        {/* Input Tanggal */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral uppercase tracking-wider">
            Pilih Tanggal
          </label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start text-left font-normal px-4 py-3.5 bg-background shadow-sm",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-neutral" />
              {date ? (
                format(date, "PPPP", { locale: id })
              ) : (
                <span>Pilih Tanggal Pemesanan</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setIsCalendarOpen(false);
                }}
                disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                locale={id}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Input Sesi */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral uppercase tracking-wider">
            Sesi Tersedia
          </label>
          <Select
            value={selectedSession}
            onValueChange={(val) => setSelectedSession(val || "")}
          >
            <SelectTrigger className="w-full px-4 py-3.5 border-border bg-background shadow-sm">
              <div className="flex items-center gap-3 flex-1 text-left">
                <Clock className="h-5 w-5 text-neutral shrink-0" />
                <span
                  className={!selectedSession ? "text-muted-foreground" : ""}
                >
                  {selectedSession
                    ? (() => {
                        const s = sessions.find(
                          (s) => s.id.toString() === selectedSession,
                        );
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
                <SelectItem key={s.id} value={s.id.toString()} className="py-3">
                  {s.name} ({s.startTime} - {s.finishTime})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Indikator Sisa Kursi */}
        {date && selectedSession && (
          <Card className="mt-2 border-border/60 shadow-sm bg-neutral-50/50">
            <CardContent className="p-3">
              {isCheckingAvailability ? (
                <span className="block text-sm font-medium text-neutral-500 animate-pulse text-center">
                  Mengecek ketersediaan kursi...
                </span>
              ) : availability ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral">
                    {isSewa ? "Ketersediaan Ruangan:" : "Ketersediaan Kursi:"}
                  </span>
                  <Badge
                    variant={isSewa ? (availability.booked === 0 ? "default" : "destructive") : availability.remainingCapacity > 0 ? "default" : "destructive"}
                    className="text-sm font-extrabold px-3 py-1.5 shadow-sm"
                  >
                    {isSewa
                      ? availability.booked === 0
                        ? "Tersedia"
                        : "Tidak Tersedia"
                      : availability.remainingCapacity > 0
                        ? `Tersedia ${availability.remainingCapacity} Kursi`
                        : "Penuh"}
                  </Badge>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Area (Sticky Bottom di Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border/50 z-50 lg:static lg:p-0 lg:bg-transparent lg:border-0 lg:z-auto mt-2 flex flex-col gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-none">
        {isSewa && (
          <p className="text-xs text-neutral/70 text-center hidden lg:block">
            *Diskon khusus tersedia untuk dosen & mahasiswa pascasarjana.
          </p>
        )}
        <Button
          className={cn(
            "w-full py-6 text-base font-bold shadow-md transition-all lg:hover:-translate-y-1",
            isUnavailable && "opacity-70"
          )}
          disabled={!date || !selectedSession || isLoading || isCheckingAvailability || isUnavailable}
          onClick={handleBooking}
        >
          {isLoading ? (
            "Memproses..."
          ) : isUnavailable ? (
            isSewa ? "Ruangan Tidak Tersedia" : "Kapasitas Penuh"
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" weight="bold" />
              {isSewa ? "Sewa Ruangan" : "Reservasi Sekarang"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
