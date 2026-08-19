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
  WhatsappLogo,
  ArrowSquareOut,
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

  const { data: availabilityMap = {}, isFetching: isCheckingAvailability } =
    useDailyAvailability(room.id, date);

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

  // Sesi khusus sewa (isRentOnly) hanya tampil di mode sewa
  const availableSessions = sessions.filter(
    (s) => isSewa || !s.isRentOnly,
  );

  // Hitung ketersediaan sesi saat ini
  const currentAvailability = selectedSession
    ? availabilityMap[selectedSession]
    : null;
  const isUnavailable = selectedSession
    ? isSewa
      ? (currentAvailability?.booked ?? 0) > 0
      : currentAvailability?.remainingCapacity === 0
    : false;

  // Efek: Kosongkan opsi dropdown jika sesi yang sedang dipilih ternyata penuh di tanggal yang baru
  useEffect(() => {
    if (selectedSession && availabilityMap[selectedSession]) {
      const sessionAvail = availabilityMap[selectedSession];
      const isSessionFull = isSewa
        ? sessionAvail.booked > 0
        : sessionAvail.remainingCapacity === 0;

      if (isSessionFull) {
        setSelectedSession("");
      }
    }
  }, [availabilityMap, selectedSession, isSewa]);

  const handleBooking = () => {
    if (!date || !selectedSession) return;

    createBookingMutation.mutate(
      {
        roomId: room.id,
        sessionId: Number(selectedSession),
        date: format(date, "yyyy-MM-dd"),
        type: isSewa ? "ROOM" : "SEAT",
      },
      {
        onSuccess: () => {
          toast.add({
            type: "success",
            title: "Pemesanan Berhasil",
            description: `Ruangan ${room.name} berhasil dipesan.`,
          });

          const sessionObj = sessions.find(
            (s) => s.id.toString() === selectedSession,
          );
          const sessionFormatted = sessionObj
            ? `${sessionObj.name} (${sessionObj.startTime} - ${sessionObj.finishTime} WITA)`
            : "-";
          const dateFormatted = date
            ? format(date, "EEEE, d MMMM yyyy", { locale: id })
            : "-";
          const priceFormatted = room.bookingPrice
            ? formatRupiah(Number(room.bookingPrice.price))
            : "-";

          setLastBookingDetails({
            dateText: dateFormatted,
            sessionText: sessionFormatted,
            priceText: priceFormatted,
          });

          setDate(undefined);
          setSelectedSession("");

          if (isSewa) {
            setShowPaymentDialog(true);
          } else {
            router.push("/reservations");
          }
        },
        onError: (error) => {
          toast.add({
            type: "error",
            title: "Pemesanan Gagal",
            description: errorMessage(
              error,
              "Terjadi kesalahan sistem saat memproses pemesanan Anda. Silakan coba lagi.",
            ),
          });
        },
      },
    );
  };

  const currentSessionObj = sessions.find(
    (s) => s.id.toString() === selectedSession,
  );
  const activeSessionText =
    lastBookingDetails?.sessionText ||
    (currentSessionObj
      ? `${currentSessionObj.name} (${currentSessionObj.startTime} - ${currentSessionObj.finishTime} WITA)`
      : "-");

  const activeDateText =
    lastBookingDetails?.dateText ||
    (date ? format(date, "EEEE, d MMMM yyyy", { locale: id }) : "-");

  const activePriceText =
    lastBookingDetails?.priceText ||
    (room.bookingPrice ? formatRupiah(Number(room.bookingPrice.price)) : "-");

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
                disabled={[
                  { before: new Date(new Date().setHours(0, 0, 0, 0)) },
                  (calendarDate) =>
                    !workingDays.includes(
                      format(calendarDate, "EEEE", { locale: id }).toLowerCase(),
                    ),
                ]}
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
                        const s = availableSessions.find(
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
                availableSessions.map((s) => {
                  const sId = s.id.toString();
                  const sessionAvail = availabilityMap[sId];

                  // Cek apakah spesifik sesi ini penuh
                  const isSessionFull = sessionAvail
                    ? isSewa
                      ? sessionAvail.booked > 0
                      : sessionAvail.remainingCapacity === 0
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

        {/* Indikator Sisa Kursi */}
        {date && selectedSession && (
          <Card className="mt-2 border-border/60 shadow-sm bg-neutral-50/50">
            <CardContent className="p-3">
              {isCheckingAvailability ? (
                <span className="block text-sm font-medium text-neutral-500 animate-pulse text-center">
                  Mengecek ketersediaan kursi...
                </span>
              ) : currentAvailability ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral">
                    {isSewa ? "Ketersediaan Ruangan:" : "Ketersediaan Kursi:"}
                  </span>
                  <Badge
                    variant={
                      isSewa
                        ? currentAvailability.booked === 0
                          ? "default"
                          : "destructive"
                        : currentAvailability.remainingCapacity > 0
                          ? "default"
                          : "destructive"
                    }
                    className="text-sm font-extrabold px-3 py-1.5 shadow-sm"
                  >
                    {isSewa
                      ? currentAvailability.booked === 0
                        ? "Tersedia"
                        : "Tidak Tersedia"
                      : currentAvailability.remainingCapacity > 0
                        ? `Tersedia ${currentAvailability.remainingCapacity} Kursi`
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
            isUnavailable && "opacity-70",
          )}
          disabled={
            !date ||
            !selectedSession ||
            isLoading ||
            isCheckingAvailability ||
            isUnavailable
          }
          onClick={handleBooking}
        >
          {isLoading ? (
            "Memproses..."
          ) : isUnavailable ? (
            isSewa ? (
              "Ruangan Tidak Tersedia"
            ) : (
              "Kapasitas Penuh"
            )
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" weight="bold" />
              {isSewa ? "Sewa Ruangan" : "Reservasi Sekarang"}
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
