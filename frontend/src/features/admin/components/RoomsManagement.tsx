"use client";

import React, { useMemo, useState } from "react";
import { RoomFilters } from "@/features/admin/components/RoomFilters";
import { RoomTable } from "@/features/admin/components/RoomTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { Room } from "@/types/room";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRooms } from "@/lib/hooks/use-rooms";
import { useDeleteRoom } from "@/lib/hooks/use-delete-room";

const PAGE_SIZE = 5;

const roomType = (room: Room) => (room.bookingPrice ? "sewa" : "reguler");

interface RoomsManagementProps {
  rooms: Room[];
}

export function RoomsManagement({ rooms: initialRooms }: RoomsManagementProps) {
  const { data: rooms = [] } = useRooms(initialRooms);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [page, setPage] = useState(1);

  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const deleteMutation = useDeleteRoom();
  const isDeleting = deleteMutation.isPending;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rooms.filter((room) => {
      const matchSearch = !q || room.name.toLowerCase().includes(q);
      const matchType =
        typeFilter === "Semua" || roomType(room) === typeFilter;
      return matchSearch && matchType;
    });
  }, [rooms, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRooms = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleDelete = () => {
    if (!roomToDelete) return;

    deleteMutation.mutate(roomToDelete.id, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "Ruangan Berhasil Dihapus",
          description: `Ruang "${roomToDelete.name}" beserta seluruh datanya telah dihapus secara permanen.`,
        });
        setRoomToDelete(null);
      },
      onError: (error) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
        toast.add({
          type: "error",
          title: "Tidak Dapat Menghapus Ruangan",
          description: message,
        });
      },
    });
  };

  return (
    <>
      <RoomFilters
        search={search}
        onSearchChange={handleSearchChange}
        type={typeFilter}
        onTypeChange={handleTypeChange}
      />

      {/* Area Tabel Data */}
      <div className="flex-1 min-h-[400px]">
        <RoomTable rooms={pagedRooms} onDelete={setRoomToDelete} />
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

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={!!roomToDelete}
        onOpenChange={(open) => {
          if (!open) setRoomToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Ruangan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus ruangan{" "}
              <span className="font-semibold">{roomToDelete?.name}</span>? Aksi
              ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoomToDelete(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
