import { Checkbox } from "@/components/ui/checkbox";

interface RoomFiltersProps {
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (checked: boolean) => void;
}

export function RoomFilters({
  showAvailableOnly,
  onShowAvailableOnlyChange,
}: RoomFiltersProps) {
  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <span className="font-semibold text-neutral tracking-wider text-xs uppercase hidden sm:block">
        Ketersediaan:
      </span>

      <label className="flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer group bg-white sm:bg-transparent border border-neutral-200 sm:border-transparent px-4 py-2.5 sm:px-0 sm:py-0 rounded-lg w-full sm:w-auto shadow-sm sm:shadow-none hover:bg-neutral-50 sm:hover:bg-transparent transition-all">
        <Checkbox
          checked={showAvailableOnly}
          onCheckedChange={(c) => onShowAvailableOnlyChange(c === true)}
          className="border-neutral-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span className="text-neutral-700 group-hover:text-primary transition-colors text-sm font-medium">
          Ruangan Yang Tersedia
        </span>
      </label>
    </div>
  );
}
