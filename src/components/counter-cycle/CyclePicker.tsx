import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Tile } from "../ui/tiles";
import { CustomCycleTile } from "./CustomCycleTile";
import { cn } from "../ui/utils";

export type CyclePickerProps = {
  selected: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  presets?: Array<{ label: string; value: number; note?: string }>;
  className?: string;
};

export function CyclePicker({ selected, onChange, min = 1, max = 1000, presets, className }: CyclePickerProps) {
  const presetList = presets ?? [
    { label: "108", value: 108, note: "Traditional" },
    { label: "54", value: 54, note: "Half" },
    { label: "27", value: 27, note: "Quarter" },
    { label: "21", value: 21, note: "Short" },
  ];

  const isPreset = useMemo(() => presetList.some(p => p.value === selected), [presetList, selected]);
  const isCustomSelected = selected != null && !isPreset;
  const [tempCustom, setTempCustom] = useState<number | "">(isCustomSelected ? (selected as number) : "");

  const handlePreset = (v: number) => onChange(v);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3">
        {presetList.map((p) => (
          <Tile
            key={p.value}
            onClick={() => handlePreset(p.value)}
            aria-pressed={selected === p.value}
            active={selected === p.value}
          >
            <div className="relative flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">{p.label}</div>
                {p.note && <div className="text-xs text-muted-foreground">{p.note}</div>}
              </div>
              <div className="text-right">
                <div className="font-bold text-primary">{p.value}</div>
                <div className="text-[10px] text-muted-foreground">counts</div>
              </div>
              {selected === p.value && (
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">
                  <Check size={14} />
                </div>
              )}
            </div>
          </Tile>
        ))}
      </div>

      <CustomCycleTile
        value={isCustomSelected ? (selected as number) : tempCustom}
        onImmediateValid={(v) => {
          setTempCustom(v);
          onChange(v);
        }}
        selected={isCustomSelected}
        min={min}
        max={max}
      />
    </div>
  );
}
