"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  ChartBar,
  FileXls,
  Trash,
  CircleNotch,
  WarningCircle,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { downloadDatabaseBackup, clearDatabaseBookings } from "@/lib/api";

const CONFIRMATION_KEYWORD = "HAPUS RIWAYAT";

export function QuickActions() {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isClearing, setIsClearing] = useState(false);

  // Handler untuk mengunduh file backup Excel
  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      await downloadDatabaseBackup();
      toast.add({
        title: "Backup Berhasil",
        description: "File backup database (.xlsx) berhasil diunduh.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Gagal Mengunduh Backup",
        description: "Terjadi kesalahan saat mengekspor database.",
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handler untuk eksekusi pembersihan riwayat booking
  const handleClearDatabase = async () => {
    if (confirmInput.trim() !== CONFIRMATION_KEYWORD) return;

    try {
      setIsClearing(true);
      const res = await clearDatabaseBookings(confirmInput.trim());
      toast.add({
        title: "Database Dibersihkan",
        description:
          res.message || "Seluruh riwayat pemesanan berhasil dibersihkan.",
        type: "success",
      });
      setIsDialogOpen(false);
      setConfirmInput("");
      router.refresh();
    } catch {
      toast.add({
        title: "Gagal Membersihkan Data",
        description:
          "Terjadi kesalahan saat membersihkan riwayat database.",
        type: "error",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <>
      <Card className="border-neutral-200 shadow-none rounded-xl h-full">
        <CardHeader className="px-6 py-5 border-b border-neutral-100 pb-4">
          <CardTitle className="text-lg font-serif font-semibold text-primary">
            Aksi Cepat
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col gap-3">
            {/* Tombol Tambah Ruangan */}
            <Button
              variant="default"
              size="lg"
              nativeButton={false}
              className="w-full justify-center gap-2"
              render={<Link href="/admin/rooms/add" />}
            >
              <PlusCircle size={18} />
              Tambah Ruangan Baru
            </Button>

            {/* Tombol Buat Laporan */}
            <Button
              variant="outlinePrimary"
              size="lg"
              nativeButton={false}
              className="w-full justify-center gap-2"
              render={<Link href="/admin/reports" />}
            >
              <ChartBar size={18} />
              Buat Laporan
            </Button>

            {/* Tombol Export Backup Database */}
            <Button
              variant="outline"
              size="lg"
              disabled={isExporting}
              onClick={handleExportBackup}
              className="w-full justify-center gap-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              {isExporting ? (
                <CircleNotch size={18} className="animate-spin text-primary" />
              ) : (
                <FileXls size={18} className="text-emerald-600" />
              )}
              {isExporting ? "Mengekspor..." : "Export Backup Data (.xlsx)"}
            </Button>

            {/* Tombol Bersihkan Database */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setConfirmInput("");
                setIsDialogOpen(true);
              }}
              className="w-full justify-center gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-dashed border-rose-200"
            >
              <Trash size={18} />
              Bersihkan Database
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog Konfirmasi Keamanan Bersihkan Database */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="gap-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
              <WarningCircle size={24} weight="fill" />
            </div>
            <DialogTitle className="text-lg font-serif font-bold text-neutral-900">
              Bersihkan Riwayat Database?
            </DialogTitle>
            <DialogDescription className="text-neutral-600 text-xs leading-relaxed">
              Tindakan ini akan <strong>menghapus seluruh riwayat pemesanan ruangan</strong> di dalam sistem untuk membebaskan ruang penyimpanan.
            </DialogDescription>
          </DialogHeader>

          {/* Kotak Info Keamanan Data Master */}
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3.5 space-y-2 text-xs text-neutral-600">
            <div className="flex items-center gap-2 font-medium text-emerald-800">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Data yang Tetap Aman:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-neutral-500 pl-1">
              <li>Akun Admin & Pengguna (Mahasiswa/Dosen/Umum)</li>
              <li>Master Ruangan & Jadwal Sesi Pemesanan</li>
              <li>Pengaturan Sistem & Narahubung WhatsApp</li>
            </ul>
          </div>

          {/* Input Konfirmasi Keamanan */}
          <div className="space-y-2 pt-2">
            <label
              htmlFor="confirm-clear"
              className="text-xs font-semibold text-neutral-700"
            >
              Ketik <span className="text-rose-600 select-all font-mono font-bold bg-rose-50 px-1 py-0.5 rounded">{CONFIRMATION_KEYWORD}</span> untuk melanjutkan:
            </label>
            <Input
              id="confirm-clear"
              placeholder={CONFIRMATION_KEYWORD}
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="font-mono text-sm"
              autoComplete="off"
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={isClearing}
              onClick={() => setIsDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              type="button"
              disabled={
                confirmInput.trim() !== CONFIRMATION_KEYWORD || isClearing
              }
              onClick={handleClearDatabase}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isClearing && (
                <CircleNotch size={16} className="animate-spin" />
              )}
              {isClearing ? "Membersihkan..." : "Ya, Bersihkan Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
