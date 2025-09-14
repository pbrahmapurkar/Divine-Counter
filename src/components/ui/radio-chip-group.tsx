import * as React from 'react';

type Option = { value: string; label: string; dot?: string };

export function RadioChipGroup({ value, onChange, options, showCustomPicker, onCustomColor }:{
  value: string; onChange: (v: string) => void;
  options: Option[];
  showCustomPicker?: boolean;
  onCustomColor?: (hex: string) => void;
}){
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            'px-4 py-2 rounded-full border text-sm',
            value === o.value ? 'border-[--dc-saffron] ring-2 ring-[--dc-saffron]/30' : '',
          ].join(' ')}
          aria-pressed={value === o.value}
        >
          {o.dot && <span className="inline-block h-2.5 w-2.5 rounded-full mr-2 align-middle" style={{ background:o.dot }} />}
          {o.label}
        </button>
      ))}
      {showCustomPicker && (
        <label className="px-4 py-2 rounded-full border text-sm cursor-pointer">
          Pick color
          <input type="color" className="sr-only" onChange={(e)=> onCustomColor?.(e.target.value)} />
        </label>
      )}
    </div>
  );
}

