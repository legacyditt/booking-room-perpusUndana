"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  Tag
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
import { cn } from "@/lib/utils";
import { Room } from "@/types/room";
import { Session } from "@/types/booking";
import { mockBookingPrices } from "@/data/mock";

interface BookingDetailsFormProps {
  room: Room;
  sessions: Session[];
}

export function BookingDetailsForm({
  room,
  sessions,
}: BookingDetailsFormProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});
const formatRupiah = (angka: number) => rupiahFormatter.format(angka);

  // Determine premium status and price from mockBookingPrices
  const bookingPrice = mockBookingPrices.find((p) => p.roomId === room.id);
  const isPremium = !!bookingPrice;
  const pricePerSessionMock = bookingPrice ? bookingPrice.price : 0;

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

          {/* Price Tag (Hanya untuk Premium) */}
          {isPremium && (
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
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-neutral shrink-0" />
                <SelectValue placeholder="Pilih Waktu Sesi" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {sessions.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()} className="py-3">
                  {s.name} ({s.timeRange})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Area (Sticky Bottom di Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border/50 z-50 lg:static lg:p-0 lg:bg-transparent lg:border-0 lg:z-auto mt-2 flex flex-col gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-none">
        {isPremium && (
          <p className="text-xs text-neutral/70 text-center hidden lg:block">
            *Diskon khusus tersedia untuk dosen & mahasiswa pascasarjana.
          </p>
        )}
        <Button 
          className="w-full py-6 text-base font-bold shadow-md transition-all lg:hover:-translate-y-1"
          disabled={!date || !selectedSession}
        >
          <CheckCircle className="w-5 h-5 mr-2" weight="bold" />
          {isPremium ? "Book Now" : "Reservasi Sekarang"}
        </Button>
      </div>

    </div>
  );
}
