"use client";

import { useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomeTabsProps {
  regulerCount: number;
  premiumCount: number;
  children: ReactNode;
}

export function HomeTabs({ regulerCount, premiumCount, children }: HomeTabsProps) {
  const [roomType, setRoomType] = useState<"reguler" | "premium">("reguler");

  const count = roomType === "reguler" ? regulerCount : premiumCount;

  return (
    <Tabs
      defaultValue="reguler"
      onValueChange={(v) => setRoomType(v as "reguler" | "premium")}
      className="w-full"
    >
      {/* Header Row: Judul, Tabs, dan Info Hasil */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary">
          Ruang Belajar Tersedia
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto mt-2 lg:mt-0">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:flex h-11 p-1">
            <TabsTrigger value="reguler">Reguler</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <div className="hidden sm:block w-px h-6 bg-neutral/20" />

          <p className="text-neutral text-sm font-medium pl-1 sm:pl-0">
            {count} Ruangan
          </p>
        </div>
      </div>

      {children}
    </Tabs>
  );
}
