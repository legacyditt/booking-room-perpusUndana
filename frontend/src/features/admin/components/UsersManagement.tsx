"use client";

import React, { useEffect, useMemo, useState } from "react";
import { UserFilters } from "@/features/admin/components/UserFilters";
import { UserTable } from "@/features/admin/components/UserTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { updateUserRole } from "@/lib/api/users";
import { AdminUser } from "@/types/admin";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 5;

const roleLabel = (role: string) => (role === "admin" ? "Admin" : "Pengguna");

interface UsersManagementProps {
  users: AdminUser[];
}

export function UsersManagement({ users: initialUsers }: UsersManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [page, setPage] = useState(1);

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [dialogRole, setDialogRole] = useState("user");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "Semua" || user.role === roleFilter;
      const matchCategory =
        categoryFilter === "Semua" || user.status === categoryFilter;
      return matchSearch && matchRole && matchCategory;
    });
  }, [users, search, roleFilter, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedUsers = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const openEditDialog = (user: AdminUser) => {
    setEditingUser(user);
    setDialogRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser || dialogRole === editingUser.role) {
      setEditingUser(null);
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateUserRole(editingUser.id, dialogRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.add({
        type: "success",
        title: "Hak Akses Diperbarui",
        description: `Peran pengguna "${updated.name}" berhasil diubah menjadi ${roleLabel(updated.role)}.`,
      });
      setEditingUser(null);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
      toast.add({
        type: "error",
        title: "Gagal Mengubah Hak Akses",
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <UserFilters
        search={search}
        onSearchChange={setSearch}
        role={roleFilter}
        onRoleChange={setRoleFilter}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {/* Area Tabel Data */}
      <div className="flex-1 min-h-[400px]">
        <UserTable users={pagedUsers} onEdit={openEditDialog} />
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

      {/* Dialog Ubah Peran */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Peran Pengguna</DialogTitle>
            <DialogDescription>
              {editingUser?.name} ({editingUser?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-neutral-700">Peran</label>
            <Select
              value={dialogRole}
              onValueChange={(value) => value && setDialogRole(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Pengguna</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              className="bg-[#0F2018] text-white hover:bg-[#0F2018]/90"
              onClick={handleSaveRole}
              disabled={isSaving || dialogRole === editingUser?.role}
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
