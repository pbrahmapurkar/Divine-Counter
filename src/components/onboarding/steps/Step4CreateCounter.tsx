import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { StableInput } from '@/components/ui/stable-input';
import { SectionCard } from '@/components/ui/section-card';
import { Stepper } from '@/components/ui/stepper';
import { Check } from 'lucide-react';

type Reminder = { hour: number; minute: number };

export type Step4Data = {
  counterName: string;
  color: string;
  customColor?: string;
  cycleSize: number;
  target: number;
};

type Props = {
  data: Step4Data;
  update: (patch: Partial<Step4Data>) => void;
  next: (payload: { counterName: string; target: number }) => void;
  back: () => void;
};

function hhmm(rem: Reminder | null | undefined): string {
  if (!rem) return '07:00';
  const h = String(rem.hour).padStart(2,'0');
  const m = String(rem.minute).padStart(2,'0');
  return `${h}:${m}`;
}
function parseTime(s: string): Reminder { const [h,m] = s.split(':'); return { hour: Math.max(0, Math.min(23, Number(h||0))), minute: Math.max(0, Math.min(59, Number(m||0))) }; }

export default function Step4CreateCounter({ data, update, next, back }: Props){
  const [name, setName] = useState<string>(data.counterName ?? '');
  const [target, setTarget] = useState<number>(data.target ?? 1);
  const [nameTouched, setNameTouched] = useState(false);
  // Reminders removed
  // Local color state (hex), defaults from incoming
  const presetColors = [
    { label: 'Saffron', hex: '#F2994A' },
    { label: 'Blue',    hex: '#007AFF' },
    { label: 'Green',   hex: '#34C759' },
  ];
  const isCustomIncoming = !!data.customColor && data.color === data.customColor;
  const [useCustom, setUseCustom] = useState<boolean>(isCustomIncoming);
  const [color, setColor] = useState<string>(isCustomIncoming ? (data.customColor as string) : data.color);
  const [customColor, setCustomColor] = useState<string | undefined>(data.customColor);

  const validName = useMemo(() => {
    const n = name.trim();
    return n.length >= 1 && n.length <= 32;
  }, [name]);
  const validTarget = target >= 0 && target <= 50;

  return (
    <motion.div
      key="create-counter-step"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <header className="text-center mb-4">
        <h1 className="text-3xl font-semibold">Create Your Counter</h1>
        <p className="opacity-70 mt-1">Personalize your first counting practice</p>
      </header>

      <SectionCard className="mb-4" title="Essentials">
        <label className="block text-sm font-medium mb-2" htmlFor="ob4-name">Mantra/Name</label>
        <StableInput
          id="ob4-name"
          value={name}
          onValue={(v) => { setName(v); }}
          placeholder="e.g., Gayatri Japa"
          aria-invalid={!validName}
          autoCapitalize="words"
          autoCorrect="off"
          onBlur={() => { setNameTouched(true); update({ counterName: name.trim() }); }}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">1–32 characters</span>
          <span className={name.trim().length >= 32 ? 'text-destructive' : 'text-muted-foreground'}>{name.trim().length}/32</span>
        </div>
        {nameTouched && !validName && (
          <p className="text-sm mt-1 text-destructive" role="alert">Enter 1–32 characters.</p>
        )}

        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Accent Color</div>
          <div className="flex flex-wrap gap-2">
            {presetColors.map(p => (
              <button
                key={p.hex}
                type="button"
                className={[
                  'px-4 py-2 rounded-full border text-sm select-none',
                  !useCustom && color===p.hex ? 'border-[--dc-saffron] ring-2 ring-[--dc-saffron]/30' : ''
                ].join(' ')}
                onClick={()=> { setUseCustom(false); setColor(p.hex); }}
                aria-pressed={!useCustom && color===p.hex}
                aria-current={!useCustom && color===p.hex ? 'true' : undefined}
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full mr-2 align-middle" style={{ background:p.hex }} />
                {p.label}
                {!useCustom && color===p.hex && (
                  <Check className="ml-2 inline-block align-middle" size={14} aria-hidden="true" />
                )}
                <span className="sr-only">{!useCustom && color===p.hex ? ' (selected)' : ''}</span>
              </button>
            ))}
            <button
              type="button"
              className={[
                'px-4 py-2 rounded-full border text-sm select-none',
                useCustom ? 'border-[--dc-saffron] ring-2 ring-[--dc-saffron]/30' : ''
              ].join(' ')}
              onClick={()=> { setUseCustom(true); setColor(customColor || '#AF52DE'); }}
              aria-pressed={useCustom}
              aria-current={useCustom ? 'true' : undefined}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full mr-2 align-middle" style={{ background: customColor || '#AF52DE' }} />
              Custom
              {useCustom && <Check className="ml-2 inline-block align-middle" size={14} aria-hidden="true" />}
              {useCustom && customColor && (
                <span className="ml-2 text-xs opacity-70">{customColor.toUpperCase()}</span>
              )}
              <span className="sr-only">{useCustom ? ' (selected)' : ''}</span>
            </button>
            {useCustom && (
              <label className="px-4 py-2 rounded-full border text-sm cursor-pointer">
                Pick color
                <input
                  type="color"
                  className="sr-only"
                  onChange={(e)=> { setCustomColor(e.target.value); setColor(e.target.value); }}
                />
              </label>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Daily Target (maalas)</div>
          <Stepper
            value={target}
            min={0}
            max={50}
            onChange={(v) => { setTarget(v); }}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[0,1,2,3,5].map(t => (
              <button
                key={t}
                type="button"
                className={[ 'px-3 py-1.5 rounded-full border text-sm', t===target ? 'border-[--dc-saffron] ring-2 ring-[--dc-saffron]/30' : '' ].join(' ')}
                onClick={()=> { setTarget(t); }}
                aria-pressed={t===target}
                aria-current={t===target ? 'true' : undefined}
              >
                {t}
                {t===target && <Check className="ml-1 inline-block align-middle" size={14} aria-hidden="true" />}
                <span className="sr-only">{t===target ? ' (selected)' : ''}</span>
              </button>
            ))}
          </div>
          <p className="text-sm opacity-70 mt-1">You can change this later in Settings.</p>
        </div>
      </SectionCard>

      {/* Reminder removed */}

      <SectionCard title="Preview" className="mb-24">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <div className="font-semibold text-foreground line-clamp-2">{name || 'My Practice'}</div>
            <div className="text-sm text-muted-foreground">{data.cycleSize} count cycle • {target} maala{target!==1?'s':''} daily</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Tip: You can edit details later from Settings → Counters.</p>
      </SectionCard>

      <footer className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-md bg-background/90 backdrop-blur border-t p-4 flex gap-3" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
        <button className="flex-1 rounded-xl border py-3" onClick={back}>‹ Back</button>
        <button
          className="flex-1 rounded-xl bg-[--dc-saffron] text-black py-3 disabled:opacity-50"
          disabled={!validName || !validTarget}
          onClick={() => {
            update({ counterName: name.trim(), target, color: useCustom ? (customColor || color) : color, customColor: useCustom ? (customColor || color) : undefined });
            next({ counterName: name.trim(), target });
          }}
        >Next ›</button>
      </footer>
    </motion.div>
  );
}
