"use client";

import { useState } from "react";
import { DownloadSimple, SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { downloadActivityLog } from "@/lib/api/users";

export function ActivityExportButton() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadActivityLog();
      toast.add({
        type: "success",
        title: "Log Diunduh",
        description: "File Excel log aktivitas admin berhasil diunduh.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Gagal Mengunduh",
        description:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ??
          "Terjadi kesalahan saat mengunduh log aktivitas.",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="h-10 gap-2 bg-[#0F2018] text-white hover:bg-[#0F2018]/90 px-5 font-medium shadow-xs shrink-0"
    >
      {exporting ? (
        <SpinnerGap className="w-4 h-4 animate-spin" />
      ) : (
        <DownloadSimple className="w-4 h-4" weight="bold" />
      )}
      Export Excel
    </Button>
  );
}