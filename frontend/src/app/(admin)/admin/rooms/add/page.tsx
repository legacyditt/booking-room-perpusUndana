import React from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { RoomForm } from "@/features/admin/components/RoomForm";

export default function AddRoomPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* ── Header Section ── */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/rooms" 
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
          Kembali ke Kelola Ruangan
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">
            Tambah Ruangan Baru
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Isi formulir di bawah ini untuk menambahkan ruangan baru ke dalam sistem.
          </p>
        </div>
      </div>

      {/* ── Form Section ── */}
      <RoomForm />
    </div>
  );
}
