"use client";

import { useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomeTabsProps {
  regulerCount: number;
  sewaCount: number;
  children: ReactNode;
}

export function HomeTabs({ regulerCount, sewaCount, children }: HomeTabsProps) {
  const [roomType, setRoomType] = useState<"reguler" | "sewa">("reguler");

  const count = roomType === "reguler" ? regulerCount + sewaCount : sewaCount;

  return (
    <Tabs
      defaultValue="reguler"
      onValueChange={(v) => setRoomType(v as "reguler" | "sewa")}
      className="w-full"
    >
      {/* Header Row: Judul, Tabs, dan Info Hasil */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary">
          Ruang Belajar Tersedia
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto mt-2 lg:mt-0">
          <TabsList className="grid w-full sm:w-[250px] grid-cols-2 h-12 p-0 bg-neutral-100 border border-neutral-200 shadow-inner overflow-hidden">
            <TabsTrigger 
              value="reguler" 
              className="h-full w-full flex items-center justify-center text-sm sm:text-base font-bold transition-all data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground data-active:shadow-md text-neutral-500 hover:text-neutral-700"
            >
              Reguler
            </TabsTrigger>
            <TabsTrigger 
              value="sewa" 
              className="h-full w-full flex items-center justify-center text-sm sm:text-base font-bold transition-all data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground data-active:shadow-md text-neutral-500 hover:text-neutral-700"
            >
              Sewa
            </TabsTrigger>
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
