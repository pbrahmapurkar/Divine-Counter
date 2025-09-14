import { useEffect, useRef, useState } from "react";
import { Tile } from "../ui/tiles";
import { NumberField } from "../ui/number-field";
import { Button } from "../ui/button";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type CustomCycleTileProps = {
  value: number | "";
  onImmediateValid: (v: number) => void;
  selected: boolean;
  min: number;
  max: number;
};

export function CustomCycleTile({ value, onImmediateValid, selected, min, max }: CustomCycleTileProps) {
  const [expanded, setExpanded] = useState<boolean>(selected);
  const [internal, setInternal] = useState<number | "">(value === "" ? "" : value);
  const [error, setError] = useState<string | null>(null);
  const lastValid = useRef<number | null>(typeof value === "number" ? value : null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setExpanded(selected);
    setInternal(value === "" ? "" : value);
    if (typeof value === "number") lastValid.current = value;
  }, [selected, value]);

  useEffect(() => {
    if (expanded) setTimeout(() => inputRef.current?.focus(), 0);
  }, [expanded]);

  const applyIfValid = (v: number | "") => {
    if (v === "") {
      setError(null);
      setInternal("");
      return;
    }
    if (v < min || v > max) {
      setError(`Range ${min}–${max}`);
      setInternal(v);
      return;
    }
    setError(null);
    setInternal(v);
    lastValid.current = v;
    onImmediateValid(v);
  };

  // steppers with hold acceleration
  const holdTimer = useRef<number | null>(null);
  const currentDelay = useRef(200);
  const stepRun = (dir: 1 | -1) => {
    const base = typeof internal === "number" ? internal : (lastValid.current ?? min);
    const next = Math.min(max, Math.max(min, base + dir));
    applyIfValid(next);
  };
  const startHold = (dir: 1 | -1) => {
    stopHold();
    currentDelay.current = 200;
    const tick = () => {
      stepRun(dir);
      // accelerate
      currentDelay.current = Math.max(60, Math.floor(currentDelay.current * 0.7));
      holdTimer.current = window.setTimeout(tick, currentDelay.current);
    };
    holdTimer.current = window.setTimeout(tick, currentDelay.current);
  };
  const stopHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const onBlur = () => {
    if (internal === "" || typeof internal !== "number" || internal < min || internal > max) {
      if (lastValid.current != null) {
        setInternal(lastValid.current);
        setError(null);
      } else {
        setExpanded(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Tile
        aria-pressed={selected}
        active={selected}
        error={!!error}
        onClick={() => setExpanded(true)}
      >
        <div className="relative flex items-center justify-between">
          <div>
            <div className="font-semibold text-foreground">Custom</div>
            {!selected && <div className="text-sm text-muted-foreground">Enter your preferred count</div>}
            {selected && typeof internal === "number" && !error && (
              <div className="mt-1">
                <span className="text-2xl font-semibold text-foreground">{internal}</span>
                <span className="ml-1 text-sm text-muted-foreground">counts</span>
              </div>
            )}
          </div>
          {selected && !error && typeof internal === "number" && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">✓</div>
          )}
        </div>
      </Tile>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pl-1 pr-1"
          >
            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-10 p-0"
                aria-label="Decrease"
                onMouseDown={() => startHold(-1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(-1)}
                onTouchEnd={stopHold}
              >
                −
              </Button>
              <NumberField
                id="custom-count"
                value={internal}
                onChange={(v) => applyIfValid(v)}
                min={min}
                max={max}
                autoFocus
                onEnter={() => inputRef.current?.blur()}
                className="text-center h-10 w-24 rounded-md border border-border bg-card"
                ariaInvalid={!!error}
                ariaDescribedby="custom-count-help"
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 w-10 p-0"
                aria-label="Increase"
                onMouseDown={() => startHold(1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(1)}
                onTouchEnd={stopHold}
              >
                +
              </Button>
            </div>
            <div id="custom-count-help" className="mt-1 text-xs text-muted-foreground" aria-live="polite">
              {error ? <span className="text-[#EF4444]">{error}</span> : "Range 1–1000"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
