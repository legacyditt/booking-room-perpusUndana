"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { UserFilters } from "@/features/admin/components/UserFilters";
import { UserTable } from "@/features/admin/components/UserTable";
import { TablePagination } from "@/features/admin/components/TablePagination";
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

import { Input } from "@/components/ui/input";
import { useUsers } from "@/lib/hooks/use-users";
import { useUpdateUserRole } from "@/lib/hooks/use-update-user-role";
import { useCreateAdmins } from "@/lib/hooks/use-create-admins";
import { useDeleteUser } from "@/lib/hooks/use-delete-user";

const PAGE_SIZE = 5;

const roleLabel = (role: string) => (role === "admin" ? "Admin" : "Pengguna");

interface UsersManagementProps {
  users: AdminUser[];
  role?: "admin" | "user";
  hideRoleFilter?: boolean;
  hideCategory?: boolean;
  actionType?: "edit" | "delete";
  showAddAdminButton?: boolean;
}

export function UsersManagement({
  users: initialUsers,
  role,
  hideRoleFilter = false,
  hideCategory = false,
  actionType = "edit",
  showAddAdminButton = false,
}: UsersManagementProps) {
  const { data: users = [] } = useUsers(role, initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [page, setPage] = useState(1);

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [dialogRole, setDialogRole] = useState("user");

  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>([""]);

  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const updateRoleMutation = useUpdateUserRole();
  const addAdminMutation = useCreateAdmins();
  const deleteMutation = useDeleteUser();

  const isSaving = updateRoleMutation.isPending || addAdminMutation.isPending;
  const isDeleting = deleteMutation.isPending;

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

  const handleSaveRole = () => {
    if (!editingUser || dialogRole === editingUser.role) {
      setEditingUser(null);
      return;
    }

    updateRoleMutation.mutate(
      { id: editingUser.id, role: dialogRole },
      {
        onSuccess: () => {
          toast.add({
            type: "success",
            title: "Hak Akses Diperbarui",
            description: `Peran pengguna "${editingUser.name}" berhasil diubah menjadi ${roleLabel(dialogRole)}.`,
          });
          setEditingUser(null);
        },
        onError: (error) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data
              ?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
          toast.add({
            type: "error",
            title: "Gagal Mengubah Hak Akses",
            description: message,
          });
        },
      },
    );
  };

  const handleAddAdmin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = adminEmails.filter(
      (email) => email.trim() !== "" && emailRegex.test(email)
    );
    if (validEmails.length === 0) {
      if (adminEmails.some(e => e.trim() !== "")) {
        toast.add({
          type: "error",
          title: "Format Email Tidak Valid",
          description: "Pastikan format email yang Anda masukkan benar.",
        });
      }
      return;
    }

    addAdminMutation.mutate(validEmails, {
      onSuccess: ({ data, failed }) => {
        setIsAddingAdmin(false);
        setAdminEmails([""]);
        if (data.length > 0) {
          toast.add({
            type: "success",
            title: `${data.length} Admin Berhasil Ditambahkan`,
            description: `Admin baru memiliki password default (admin123).`,
          });
        }
        if (failed.length > 0) {
          toast.add({
            type: "error",
            title: `${failed.length} Email Gagal Diproses`,
            description: `Email yang gagal: ${failed.join(", ")}`,
          });
        }
      },
      onError: (error) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
        toast.add({
          type: "error",
          title: "Gagal Menambahkan Admin",
          description: message,
        });
      },
    });
  };

  const handleDeleteAdmin = (user: AdminUser) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    deleteMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "Admin Dihapus",
          description: `Admin "${userToDelete.name}" telah dihapus.`,
        });
        setUserToDelete(null);
      },
      onError: (error) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Terjadi kesalahan sistem. Silakan coba lagi.";
        toast.add({
          type: "error",
          title: "Gagal Menghapus Admin",
          description: message,
        });
      },
    });
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
        hideRoleFilter={hideRoleFilter}
        hideCategoryFilter={hideCategory}
        showAddAdminButton={showAddAdminButton}
        onAddAdmin={() => setIsAddingAdmin(true)}
      />

      {/* Area Tabel Data */}
      <div className="flex-1 min-h-[400px]">
        <UserTable
          users={pagedUsers}
          onEdit={openEditDialog}
          onDelete={handleDeleteAdmin}
          hideCategoryColumn={hideCategory}
          actionType={actionType}
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
                <SelectValue>
                  {dialogRole === "admin" ? "Admin" : "Pengguna"}
                </SelectValue>
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

      {/* Dialog Tambah Admin */}
      <Dialog open={isAddingAdmin} onOpenChange={setIsAddingAdmin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Admin Baru</DialogTitle>
            <DialogDescription>
              Masukkan email untuk menambahkan admin baru. Password default adalah <strong>admin123</strong>. Admin dapat mengganti password setelah login.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">Email Admin</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setAdminEmails([...adminEmails, ""])}
                  className="h-7 text-xs flex items-center gap-1"
                >
                  <Plus size={14} weight="bold" />
                  Tambah
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {adminEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="contoh@undana.ac.id"
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...adminEmails];
                        newEmails[index] = e.target.value;
                        setAdminEmails(newEmails);
                      }}
                    />
                    {adminEmails.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newEmails = [...adminEmails];
                          newEmails.splice(index, 1);
                          setAdminEmails(newEmails);
                        }}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                      >
                        <Trash size={18} weight="bold" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingAdmin(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddAdmin}
              disabled={isSaving || adminEmails.every(e => e.trim() === "")}
            >
              {isSaving ? "Menambahkan..." : "Tambah Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus Admin */}
      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setUserToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Admin</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus admin{" "}
              <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
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
