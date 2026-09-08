"use client";

import { useState, useEffect } from "react";
import {
  format,
  differenceInCalendarDays,
  eachDayOfInterval,
} from "date-fns";
import { id } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  Tag,
  WhatsappLogo,
  ArrowSquareOut,
  CalendarBlank,
} from "@phosphor-icons/react/dist/ssr";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useSession } from "@/lib/api/auth-client";
import { useCreateBooking } from "@/lib/hooks/use-create-booking";
import { useDailyAvailability } from "@/lib/hooks/use-daily-availability";
import { useMonthAvailability } from "@/lib/hooks/use-month-availability";
import { errorMessage } from "@/lib/api/errors";
import {
  formatWhatsappTemplate,
  DEFAULT_WHATSAPP_TEMPLATE,
} from "@/lib/api/settings";

interface BookingDetailsFormProps {
  room: Room;
  sessions: Session[];
  workingDays?: string[];
  adminWhatsapp?: string;
  whatsappTemplate?: string;
  mode?: "reguler" | "sewa";
}

function formatWhatsappUrl(phone: string, text: string) {
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith("62")) {
    cleanPhone = "62" + cleanPhone;
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function BookingDetailsForm({
  room,
  sessions,
  workingDays = ["senin", "selasa", "rabu", "kamis", "jumat"],
  adminWhatsapp = "081234567890",
  whatsappTemplate,
  mode = "reguler",
}: BookingDetailsFormProps) {
  const { data: session } = useSession();
  const [date, setDate] = useState<Date | undefined>();
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [lastBookingDetails, setLastBookingDetails] = useState<{
    dateText: string;
    sessionText: string;
    priceText: string;
  } | null>(null);

  const createBookingMutation = useCreateBooking();
  const isLoading = createBookingMutation.isPending;

  const router = useRouter();

  const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const formatRupiah = (angka: number) => rupiahFormatter.format(angka);

  const bookingPrice = room.bookingPrice;
  const pricePerSessionMock = bookingPrice ? Number(bookingPrice.price) : 0;
  const isSewa = mode === "sewa";

  const todayNoTime = new Date();
  todayNoTime.setHours(0, 0, 0, 0);

  // ── Mode Sewa: range date picker + ketersediaan bulanan ──
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [displayedMonth, setDisplayedMonth] = useState<Date | undefined>(
    new Date(),
  );
  const { data: monthAvailability = {}, isFetching: isCheckingMonth } =
    useMonthAvailability(room.id, displayedMonth);

  const dateKey = (d: Date) => format(d, "yyyy-MM-dd");
  const isPast = (d: Date) =>
    format(d, "yyyy-MM-dd") < format(todayNoTime, "yyyy-MM-dd");
  const isWorkingDay = (d: Date) =>
    workingDays.includes(format(d, "EEEE", { locale: id }).toLowerCase());
  const isBooked = (d: Date) =>
    monthAvailability[dateKey(d)]?.unavailable === true &&
    isWorkingDay(d) &&
    !isPast(d);
  const isBlockedDay = (d: Date) =>
    isPast(d) || !isWorkingDay(d) || isBooked(d);

  const rangeDays = dateRange?.from && dateRange.to
    ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
    : [];

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setDateRange(undefined);
      return;
    }
    if (isBooked(range.from)) {
      setDateRange(undefined);
      return;
    }
    if (range.to) {
      const days = eachDayOfInterval({ start: range.from, end: range.to });
      if (days.some((d) => isBlockedDay(d))) {
        toast.add({
          type: "error",
          title: "Rentang Tidak Valid",
          description:
            "Rentang tidak boleh melewati hari yang sudah dipesan atau bukan hari kerja.",
        });
        setDateRange({ from: range.from, to: undefined });
        return;
      }
      setDateRange(range);
      return;
    }
    setDateRange({ from: range.from, to: undefined });
  };

  // ── Mode Reguler: ketersediaan sesi harian ──
  const {
    data: availabilityMap = {},
    isFetching: isCheckingAvailability,
    isError: isAvailabilityError,
  } = useDailyAvailability(room.id, date);

  const currentAvailability = selectedSession
    ? availabilityMap[selectedSession]
    : null;
  const isUnavailable =
    Boolean(selectedSession && currentAvailability && currentAvailability.remainingCapacity === 0);

  // Efek: Kosongkan opsi dropdown jika sesi yang sedang dipilih ternyata penuh di tanggal yang baru
  useEffect(() => {
    if (selectedSession && availabilityMap[selectedSession]) {
      if (availabilityMap[selectedSession].remainingCapacity === 0) {
        setSelectedSession("");
      }
    }
  }, [availabilityMap, selectedSession]);

  const handleBooking = () => {
    if (isSewa) {
      if (!dateRange?.from || !dateRange.to) return;

      createBookingMutation.mutate(
        {
          roomId: room.id,
          type: "ROOM",
          startDate: dateKey(dateRange.from),
          endDate: dateKey(dateRange.to),
        },
        bookingSuccessCallbacks,
      );
      return;
    }

    if (!date || !selectedSession) return;

    createBookingMutation.mutate(
      {
        roomId: room.id,
        sessionId: Number(selectedSession),
        date: dateKey(date),
        type: "SEAT",
      },
      bookingSuccessCallbacks,
    );
  };

  const bookingSuccessCallbacks = {
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Pemesanan Berhasil",
        description: `Ruangan ${room.name} berhasil dipesan.`,
      });

      setLastBookingDetails(
        isSewa && dateRange?.from && dateRange.to
          ? {
              dateText: `${format(dateRange.from, "d MMMM", { locale: id })} - ${format(dateRange.to, "d MMMM yyyy", { locale: id })}`,
              sessionText: "Sehari Penuh",
              priceText: formatRupiah(
                pricePerSessionMock *
                  (Math.abs(
                    differenceInCalendarDays(dateRange.to, dateRange.from),
                  ) + 1),
              ),
            }
          : {
              dateText: date
                ? format(date, "EEEE, d MMMM yyyy", { locale: id })
                : "-",
              sessionText: (() => {
                const sessionObj = sessions.find(
                  (s) => s.id.toString() === selectedSession,
                );
                return sessionObj
                  ? `${sessionObj.name} (${sessionObj.startTime} - ${sessionObj.finishTime} WITA)`
                  : "-";
              })(),
              priceText: room.bookingPrice
                ? formatRupiah(pricePerSessionMock)
                : "-",
            },
      );

      setDate(undefined);
      setSelectedSession("");
      setDateRange(undefined);

      if (isSewa) {
        setShowPaymentDialog(true);
      } else {
        router.push("/reservations");
      }
    },
    onError: (error: unknown) => {
      toast.add({
        type: "error",
        title: "Pemesanan Gagal",
        description: errorMessage(
          error,
          "Terjadi kesalahan sistem saat memproses pemesanan Anda. Silakan coba lagi.",
        ),
      });
    },
  };

  const rangeCount =
    dateRange?.from && dateRange.to
      ? Math.abs(differenceInCalendarDays(dateRange.to, dateRange.from)) + 1
      : 0;

  const currentSessionObj = sessions.find(
    (s) => s.id.toString() === selectedSession,
  );
  const activeSessionText =
    lastBookingDetails?.sessionText ||
    (isSewa
      ? "Sehari Penuh"
      : currentSessionObj
        ? `${currentSessionObj.name} (${currentSessionObj.startTime} - ${currentSessionObj.finishTime} WITA)`
        : "-");

  const activeDateText =
    lastBookingDetails?.dateText ||
    (isSewa
      ? dateRange?.from && dateRange.to
        ? `${format(dateRange.from, "d MMMM", { locale: id })} - ${format(dateRange.to, "d MMMM yyyy", { locale: id })}`
        : "-"
      : date
        ? format(date, "EEEE, d MMMM yyyy", { locale: id })
        : "-");

  const activePriceText =
    lastBookingDetails?.priceText ||
    (isSewa
      ? dateRange?.from && dateRange.to
        ? formatRupiah(pricePerSessionMock * rangeCount)
        : "-"
      : room.bookingPrice
        ? formatRupiah(pricePerSessionMock)
        : "-");

  const waMessage = formatWhatsappTemplate(
    whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
    {
      ruangan: room.name,
      tanggal: activeDateText,
      sesi: activeSessionText,
      total_biaya: activePriceText,
      nama_pemesan: session?.user?.name || "-",
    },
  );

  const waUrl = formatWhatsappUrl(adminWhatsapp, waMessage);

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
                {formatRupiah(pricePerSessionMock)} / hari
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
            {isSewa ? "Pilih Rentang Tanggal" : "Pilih Tanggal"}
          </label>

          {isSewa ? (
            <>
              <div className="p-3 bg-neutral-50/60 border border-border/50 rounded-lg text-sm">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start text-left font-normal px-4 py-3.5 bg-background shadow-sm",
                      !dateRange?.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarBlank className="mr-3 h-5 w-5 text-neutral" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <span>
                          {format(dateRange.from, "d MMM yyyy", {
                            locale: id,
                          })}{" "}
                          -{" "}
                          {format(dateRange.to, "d MMM yyyy", { locale: id })}
                        </span>
                      ) : (
                        <span>
                          {format(dateRange.from, "d MMM yyyy", { locale: id })}{" "}
                          - <span className="text-muted-foreground">pilih akhir</span>
                        </span>
                      )
                    ) : (
                      <span>Pilih Rentang Tanggal Pemesanan</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={handleRangeSelect}
                      onMonthChange={(month) => setDisplayedMonth(month)}
                      disabled={(d) => isPast(d) || !isWorkingDay(d)}
                      modifiers={{ unavailable: (d) => isBooked(d) }}
                      modifiersClassNames={{
                        unavailable:
                          "bg-red-100! text-red-600! opacity-100! rounded-(--cell-radius)",
                      }}
                      locale={id}
                    />
                    <div className="px-4 pb-3 flex flex-wrap gap-3 text-[11px] text-neutral/70">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block size-3 rounded bg-red-100 border border-red-300" />
                        Sudah dipesan
                      </span>
                      {dateRange?.from && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block size-3 rounded bg-primary" />
                          Rentang pilihan
                        </span>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Ringkasan Range + Total Harga */}
              {rangeCount > 0 && (
                <Card className="mt-2 border-border/60 shadow-sm bg-neutral-50/50">
                  <CardContent className="p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral">
                        Jumlah Hari:
                      </span>
                      <Badge className="text-sm font-extrabold px-3 py-1 shadow-sm">
                        {rangeCount} hari
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral">
                        Total Harga:
                      </span>
                      <span className="text-sm font-extrabold text-primary">
                        {formatRupiah(pricePerSessionMock * rangeCount)}
                      </span>
                    </div>
                    {isCheckingMonth && (
                      <span className="text-xs text-neutral-500 animate-pulse">
                        Memuat ketersediaan...
                      </span>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
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
                  disabled={(calendarDate) =>
                    isPast(calendarDate) || !isWorkingDay(calendarDate)
                  }
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Input Sesi (hanya mode Reguler) */}
        {!isSewa && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral uppercase tracking-wider">
              Sesi Tersedia
            </label>
            <Select
              value={selectedSession}
              onValueChange={(val) => setSelectedSession(val || "")}
              disabled={!date || isCheckingAvailability}
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
                {!date ? (
                  <SelectItem value="__no-date__" disabled>
                    Pilih tanggal terlebih dahulu
                  </SelectItem>
                ) : isCheckingAvailability ? (
                  <SelectItem value="__loading__" disabled>
                    Memuat ketersediaan sesi...
                  </SelectItem>
                ) : (
                  sessions.map((s) => {
                    const sId = s.id.toString();
                    const sessionAvail = availabilityMap[sId];
                    const isSessionFull = sessionAvail
                      ? sessionAvail.remainingCapacity === 0
                      : false;

                    return (
                      <SelectItem
                        key={s.id}
                        value={sId}
                        className={isSessionFull ? "opacity-50 py-3" : "py-3"}
                        disabled={isSessionFull}
                      >
                        {s.name} ({s.startTime} - {s.finishTime})
                        {isSessionFull && " - (Penuh)"}
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Indikator Sisa Kursi (mode Reguler) */}
        {!isSewa && date && selectedSession && (
          <Card className="mt-2 border-border/60 shadow-sm bg-neutral-50/50">
            <CardContent className="p-3">
              {isCheckingAvailability ? (
                <span className="block text-sm font-medium text-neutral-500 animate-pulse text-center">
                  Mengecek ketersediaan kursi...
                </span>
              ) : currentAvailability ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral">
                    Ketersediaan Kursi:
                  </span>
                  <Badge
                    variant={
                      currentAvailability.remainingCapacity > 0
                        ? "default"
                        : "destructive"
                    }
                    className="text-sm font-extrabold px-3 py-1.5 shadow-sm"
                  >
                    {currentAvailability.remainingCapacity > 0
                      ? `Tersedia ${currentAvailability.remainingCapacity} Kursi`
                      : "Penuh"}
                  </Badge>
                </div>
              ) : isAvailabilityError ? (
                <span className="block text-xs text-destructive text-center font-medium">
                  Gagal memuat ketersediaan kursi. Silakan muat ulang halaman.
                </span>
              ) : (
                <span className="block text-xs text-neutral-500 animate-pulse text-center">
                  Memuat informasi kursi...
                </span>
              )}
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
            isSewa
              ? (isLoading || isCheckingMonth || rangeCount === 0) &&
                  "opacity-70"
              : isUnavailable && "opacity-70",
          )}
          disabled={
            isSewa
              ? isLoading || isCheckingMonth || rangeCount === 0
              : !date ||
                !selectedSession ||
                isLoading ||
                isCheckingAvailability ||
                !currentAvailability ||
                isUnavailable
          }
          onClick={handleBooking}
        >
          {isLoading ? (
            "Memproses..."
          ) : isSewa ? (
            rangeCount === 0 ? (
              "Pilih Rentang Tanggal"
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" weight="bold" />
                Sewa Ruangan ({rangeCount} Hari)
              </>
            )
          ) : isCheckingAvailability ? (
            "Memeriksa Ketersediaan..."
          ) : isUnavailable ? (
            "Kapasitas Penuh"
          ) : !currentAvailability && selectedSession ? (
            "Memuat Ketersediaan..."
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" weight="bold" />
              Reservasi Sekarang
            </>
          )}
        </Button>
      </div>
      {/* Dialog Pembayaran untuk Mode Sewa */}
      <Dialog
        open={showPaymentDialog}
        onOpenChange={(open) => {
          setShowPaymentDialog(open);
          if (!open) {
            router.push("/reservations");
          }
        }}
      >
        <DialogContent className="sm:max-w-md p-6 bg-white border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-primary">
              Instruksi Pembayaran
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral/80 mt-2">
              Pesanan ruangan Anda telah berhasil dicatat. Untuk melanjutkan
              proses sewa, silakan lakukan pembayaran dan konfirmasi melalui
              nomor admin di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4 pb-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center p-4 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200 hover:border-emerald-400 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer text-center"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                <WhatsappLogo size={16} weight="fill" className="text-[#25D366]" />
                <span>Nomor WhatsApp Admin</span>
              </div>
              <div className="text-xl font-bold text-primary group-hover:text-emerald-800 transition-colors inline-flex items-center gap-2">
                <span>{adminWhatsapp}</span>
                <ArrowSquareOut
                  size={18}
                  weight="bold"
                  className="text-emerald-600 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <span className="text-[11px] text-emerald-700/80 mt-1 font-medium">
                Klik untuk langsung menghubungi Admin
              </span>
            </a>

            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentDialog(false);
                router.push("/reservations");
              }}
              className="w-full text-neutral-600 hover:text-primary"
            >
              Lihat Pemesanan Saya
            </Button>

            <p className="text-xs text-center text-neutral/70">
              *Tunjukkan bukti pesanan (pada menu Pemesanan Saya) dan bukti
              transfer saat menghubungi admin.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}