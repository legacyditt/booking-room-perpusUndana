"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle
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

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const isPremium = room.type === "premium";
  const standardRate = room.pricePerSession;
  const totalPrice = selectedSession && date ? standardRate : 0;

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Card 1: Informasi Ruangan & Kapasitas */}
      <div className="p-6 bg-white border border-border/50 rounded-xl shadow-sm flex flex-col gap-4">
        <h1 className="text-3xl font-serif font-bold text-primary">
          {room.name}
        </h1>
        <div className="flex items-center gap-3 text-neutral/80">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">
            Kapasitas: Maksimal {room.capacity} Orang
          </span>
        </div>
      </div>

      {/* Card 2: Form Booking Details */}
      <div className="p-6 bg-white border border-border/50 rounded-xl shadow-sm flex flex-col gap-6">
        <h3 className="font-bold text-xl text-primary border-b border-border pb-4">
          Booking Details
        </h3>

        {/* Pricing Info (Conditional Rendering: Hanya dirender jika isPremium true) */}
        {isPremium && (
          <div className="flex justify-between items-center border-b border-border pb-4">
            <span className="text-sm font-medium text-neutral">Standard Rate</span>
            <span className="text-lg font-bold text-primary">
              {formatRupiah(standardRate)} / sesi
            </span>
          </div>
        )}

        {/* Input Tanggal */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral uppercase tracking-wider">
            Pilih Tanggal
          </label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start text-left font-normal px-4 py-4 bg-background shadow-sm",
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
            <SelectTrigger className="w-full px-4 py-4 border-border bg-background shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-neutral shrink-0" />
                <SelectValue placeholder="Pilih Waktu Sesi">
                  {selectedSession
                    ? sessions
                        .filter((s) => s.id === selectedSession)
                        .map((s) => `${s.name} (${s.timeRange})`)
                    : "Pilih Waktu Sesi"}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {sessions.map((s) => (
                <SelectItem key={s.id} value={s.id} className="py-3">
                  {s.name} ({s.timeRange})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Total Price Section (Conditional Rendering) */}
        {isPremium && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-neutral">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatRupiah(totalPrice)}
              </span>
            </div>
            <p className="text-xs text-neutral/70 text-right">
              *Diskon khusus tersedia untuk dosen & mahasiswa pascasarjana.
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full py-6 text-base font-bold shadow-md mt-2 transition-all hover:-translate-y-1"
          disabled={!date || !selectedSession}
        >
          <CheckCircle className="w-5 h-5 mr-2" weight="bold" />
          {isPremium ? "Book Now" : "Reservasi Sekarang"}
        </Button>
      </div>
    </div>
  );
}
