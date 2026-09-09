import { PencilSimple, Trash, Users } from "@phosphor-icons/react/dist/ssr";
import { AdminUser } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const roleConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  admin: { label: "Admin", variant: "default" },
  user: { label: "Pengguna", variant: "outline" },
};

const categoryConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  mahasiswa: { label: "Mahasiswa", variant: "secondary" },
  dosen: { label: "Dosen", variant: "default" },
  umum: { label: "Umum", variant: "outline" },
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

interface UserTableProps {
  users: AdminUser[];
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
  hideCategoryColumn?: boolean;
  actionType?: "edit" | "delete";
  onResetFilters?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  hideCategoryColumn = false,
  actionType = "edit",
  onResetFilters,
  emptyTitle = "Tidak Ada Pengguna Ditemukan",
  emptyDescription = "Tidak ada pengguna yang cocok dengan kata kunci pencarian atau filter yang dipilih.",
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} weight="duotone" />}
        title={emptyTitle}
        description={emptyDescription}
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="w-full">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-[#FAFAFA] border-b border-[#E2E8F0]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto">
              PROFIL PENGGUNA
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              PERAN
            </TableHead>
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              TANGGAL BERGABUNG
            </TableHead>
            {!hideCategoryColumn && (
              <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
                KATEGORI
              </TableHead>
            )}
            <TableHead className="px-5 py-4 font-semibold text-neutral-600 h-auto text-center">
              AKSI
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const role =
              roleConfig[user.role] ?? { label: user.role, variant: "outline" as BadgeVariant };
            const category =
              categoryConfig[user.status] ??
              { label: user.status, variant: "outline" as BadgeVariant };

            return (
              <TableRow
                key={user.id}
                className="hover:bg-neutral-50/50 transition-colors border-[#E2E8F0]"
              >
                <TableCell className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-primary">{user.name}</span>
                    <span className="text-xs text-neutral-500">{user.email}</span>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4 text-center">
                  <Badge variant={role.variant} className="min-w-[100px] justify-center">
                    {role.label}
                  </Badge>
                </TableCell>

                <TableCell className="px-5 py-4 text-neutral-600 text-center">
                  {dateFormatter.format(new Date(user.createdAt))}
                </TableCell>

                {!hideCategoryColumn && (
                  <TableCell className="px-5 py-4 text-center">
                    <Badge
                      variant={category.variant}
                      className="min-w-[100px] justify-center"
                    >
                      {category.label}
                    </Badge>
                  </TableCell>
                )}

                <TableCell className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    {actionType === "edit" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-primary w-8 h-8"
                        title="Ubah Peran Pengguna"
                        onClick={() => onEdit?.(user)}
                      >
                        <PencilSimple weight="bold" size={18} />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 w-8 h-8"
                        title="Hapus Admin"
                        onClick={() => onDelete?.(user)}
                      >
                        <Trash weight="bold" size={18} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
