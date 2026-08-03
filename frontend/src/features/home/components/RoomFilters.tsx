import { Checkbox } from "@/components/ui/checkbox";

interface RoomFiltersProps {
  showAvailableOnly: boolean;
  onShowAvailableOnlyChange: (checked: boolean) => void;
}

export function RoomFilters({ showAvailableOnly, onShowAvailableOnlyChange }: RoomFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm mt-4 mb-8">
      <span className="font-semibold text-neutral tracking-wider text-xs uppercase">Availability:</span>
      
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer group">
          <Checkbox 
            checked={showAvailableOnly} 
            onCheckedChange={(c) => onShowAvailableOnlyChange(c === true)} 
            className="border-neutral/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-neutral group-hover:text-primary transition-colors">Available Now</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <Checkbox 
            checked={!showAvailableOnly}
            onCheckedChange={(c) => onShowAvailableOnlyChange(c === false)}
            className="border-neutral/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-neutral group-hover:text-primary transition-colors">Include Unavailable</span>
        </label>
      </div>
    </div>
  );
}
