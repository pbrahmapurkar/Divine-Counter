import { useCallback } from "react";

export type NumberFieldProps = {
  value: number | "";
  onChange: (v: number | "") => void;
  min: number;
  max: number;
  step?: number;
  stepShift?: number;
  autoFocus?: boolean;
  onEnter?: () => void;
  id?: string;
  className?: string;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
};

export function NumberField({ value, onChange, min, max, step = 1, stepShift = 10, autoFocus, onEnter, id, className, ariaInvalid, ariaDescribedby }: NumberFieldProps) {
  const sanitize = useCallback((s: string) => s.replace(/\D/g, "").slice(0, 4), []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const current = typeof value === "number" ? value : min;
      const delta = (e.shiftKey ? stepShift : step) * (e.key === "ArrowUp" ? 1 : -1);
      const next = Math.min(max, Math.max(min, current + delta));
      onChange(next);
    }
  };

  return (
    <input
      id={id}
      autoFocus={autoFocus}
      inputMode="numeric"
      pattern="[0-9]*"
      type="text"
      value={value === "" ? "" : String(value)}
      onKeyDown={handleKeyDown}
      onChange={(e) => onChange(sanitize(e.target.value) === "" ? "" : Number(sanitize(e.target.value)))}
      className={className}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
    />
  );
}
