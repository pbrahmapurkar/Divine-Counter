import { cn } from "./utils";

export type ThemeKey = 'saffron' | 'blue' | 'green';

type ColorRadioProps = {
  value: ThemeKey;
  onChange: (t: ThemeKey) => void;
};

const presets: { key: ThemeKey; label: string; color: string }[] = [
  { key: 'saffron', label: 'Saffron', color: '#F2994A' },
  { key: 'blue', label: 'Blue', color: '#007AFF' },
  { key: 'green', label: 'Green', color: '#34C759' },
];

export function ColorRadio({ value, onChange }: ColorRadioProps) {
  const selected = (value === 'saffron' || value === 'blue' || value === 'green') ? value : 'saffron';
  return (
    <div className="grid grid-cols-2 gap-2">
      {presets.map((p) => (
        <button
          key={p.key}
          type="button"
          className={cn(
            "rounded-xl border px-4 py-3 text-left transition-all",
            selected === p.key ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:border-primary/40"
          )}
          onClick={() => onChange(p.key)}
          aria-pressed={selected === p.key}
        >
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: p.color }} />
            <span className="font-medium text-foreground">{p.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
