"use client";

import React, { useMemo, useState } from "react";
import { ReservationFilters } from "@/features/admin/components/ReservationFilters";
import { ReservationTable } from "@/features/admin/components/ReservationTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { Booking, BookingStatus } from "@/types/booking";
import { isSeatApproved } from "@/lib/booking-status";
import { toast } from "@/components/ui/toast";
import { useAllBookings } from "@/lib/hooks/use-all-bookings";
import { useUpdateBookingStatus } from "@/lib/hooks/use-update-booking-status";

const PAGE_SIZE = 5;

interface ReservationsManagementProps {
  bookings: Booking[];
}

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? fallback;

export function ReservationsManagement({
  bookings: initialBookings,
}: ReservationsManagementProps) {
  const { data: bookings = [] } = useAllBookings(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [page, setPage] = useState(1);

  const updateStatusMutation = useUpdateBookingStatus();
  const isUpdatingId = updateStatusMutation.isPending
    ? (updateStatusMutation.variables?.id ?? null)
    : null;

  const handleUpdateStatus = (id: number, status: BookingStatus) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          const label = status === "APPROVED" ? "disetujui" : "ditolak";
          toast.add({
            type: "success",
            title: `Pemesanan Berhasil ${status === "APPROVED" ? "Disetujui" : "Ditolak"}`,
            description: `Pengajuan pemesanan #BKG-${id} telah ${label}.`,
          });
        },
        onError: (error) => {
          toast.add({
            type: "error",
            title: "Tindakan Gagal Diproses",
            description: errorMessage(
              error,
              "Terjadi kesalahan saat memperbarui status pemesanan. Silakan coba beberapa saat lagi.",
            ),
          });
        },
      },
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchSearch =
        !q ||
        booking.user?.name.toLowerCase().includes(q) ||
        booking.room.name.toLowerCase().includes(q) ||
        String(booking.id).includes(q);

      const matchStatus =
        statusFilter === "Semua"
          ? true
          : statusFilter === "DIPESAN"
            ? isSeatApproved(booking)
            : statusFilter === "APPROVED"
              ? booking.type === "ROOM" && booking.status === "APPROVED"
              : booking.status === statusFilter;

      const bookingDateStr = booking.date.slice(0, 10);
      const matchStart = !startDate || bookingDateStr >= startDate;
      const matchEnd = !endDate || bookingDateStr <= endDate;

      const matchType =
        typeFilter === "Semua" ||
        (booking.type === "ROOM" ? "sewa" : "reguler") === typeFilter;

      return matchSearch && matchStatus && matchStart && matchEnd && matchType;
    });
  }, [bookings, search, statusFilter, startDate, endDate, typeFilter]);

  // Urutkan: booking sewa selalu di atas. Urutan dalam grup tetap (createdAt desc).
  const grouped = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => Number(b.type === "ROOM") - Number(a.type === "ROOM"),
      ),
    [filtered],
  );

  const totalPages = Math.max(1, Math.ceil(grouped.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedBookings = grouped.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const resetPage = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const handleClearDate = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <>
      <ReservationFilters
        search={search}
        onSearchChange={resetPage(setSearch)}
        status={statusFilter}
        onStatusChange={resetPage(setStatusFilter)}
        startDate={startDate}
        onStartDateChange={resetPage(setStartDate)}
        endDate={endDate}
        onEndDateChange={resetPage(setEndDate)}
        onClearDate={handleClearDate}
        type={typeFilter}
        onTypeChange={resetPage(setTypeFilter)}
      />

      {/* Area Tabel Data */}
      <div className="flex-1 min-h-[400px]">
        <ReservationTable
          bookings={pagedBookings}
          onUpdateStatus={handleUpdateStatus}
          isUpdatingId={isUpdatingId}
        />
      </div>

      {/* Area Pagination */}
      <div className="p-5 border-t border-[#E2E8F0] bg-white">
        <TablePagination
          page={safePage}
          pageSize={PAGE_SIZE}
          totalItems={filtered.length}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
