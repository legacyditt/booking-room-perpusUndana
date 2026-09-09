"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";

export function AdminOverviewHeader() {
  const [greeting, setGreeting] = useState("Selamat datang, Admin!");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 4 && hour < 11) {
      setGreeting("Selamat Pagi, Admin!");
    } else if (hour >= 11 && hour < 15) {
      setGreeting("Selamat Siang, Admin!");
    } else if (hour >= 15 && hour < 18) {
      setGreeting("Selamat Sore, Admin!");
    } else {
      setGreeting("Selamat Malam, Admin!");
    }

    setFormattedDate(format(now, "EEEE, d MMMM yyyy", { locale: id }));
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-1">
          {greeting}
        </h1>
        <p className="text-neutral-500 text-sm">
          Ini adalah ringkasan aktivitas dan peminjaman ruangan hari ini.
        </p>
      </div>

      {formattedDate && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-medium text-neutral-600 shadow-2xs self-start sm:self-auto">
          <CalendarBlank size={16} weight="duotone" className="text-primary" />
          <span>{formattedDate}</span>
        </div>
      )}
    </div>
  );
}
