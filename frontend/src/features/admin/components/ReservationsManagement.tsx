"use client";

import React, { useMemo, useState } from "react";
import { ReservationFilters } from "@/features/admin/components/ReservationFilters";
import { ReservationTable } from "@/features/admin/components/ReservationTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { updateBookingStatus } from "@/lib/api/bookings";
import { Booking, BookingStatus } from "@/types/booking";
import { isPremiumRoom } from "@/types/room";
import { toast } from "@/components/ui/toast";

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
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchSearch =
        !q ||
        booking.user?.name.toLowerCase().includes(q) ||
        booking.room.name.toLowerCase().includes(q) ||
        String(booking.id).includes(q);
      const matchStatus =
        statusFilter === "Semua" || booking.status === statusFilter;
      const matchDate = !dateFilter || booking.date.slice(0, 10) === dateFilter;
      const matchType =
        typeFilter === "Semua" ||
        (isPremiumRoom(booking.room) ? "premium" : "reguler") === typeFilter;
      return matchSearch && matchStatus && matchDate && matchType;
    });
  }, [bookings, search, statusFilter, dateFilter, typeFilter]);

  // Urutkan: ruangan premium selalu di atas. Urutan dalam grup tetap (createdAt desc).
  const grouped = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => Number(isPremiumRoom(b.room)) - Number(isPremiumRoom(a.room)),
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

  const handleUpdateStatus = async (id: number, status: BookingStatus) => {
    setIsUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      const label = status === "APPROVED" ? "disetujui" : "ditolak";
      toast.add({
        type: "success",
        title: `Pemesanan ${status === "APPROVED" ? "Disetujui" : "Ditolak"}`,
        description: `Pemesanan #BKG-${id} berhasil ${label}.`,
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Gagal Memperbarui Status",
        description: errorMessage(
          error,
          "Terjadi kesalahan sistem. Silakan coba lagi.",
        ),
      });
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <>
      <ReservationFilters
        search={search}
        onSearchChange={resetPage(setSearch)}
        status={statusFilter}
        onStatusChange={resetPage(setStatusFilter)}
        date={dateFilter}
        onDateChange={resetPage(setDateFilter)}
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
