import { useState } from 'react';
import { ChevronLeft, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { StableInput } from './ui/stable-input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { NumberField } from './ui/number-field';
import { cn } from './ui/utils';

type SaveInput = { name: string; color: string; cycleSize: number; target: number };

export function CreateCounterPage({ onCancel, onSave }: { onCancel: () => void; onSave: (input: SaveInput) => void }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#34C759');
  const [cycleSize, setCycleSize] = useState(108);
  const [customCycle, setCustomCycle] = useState('');
  const [target, setTarget] = useState(1);
  // reminders removed

  const [nameError, setNameError] = useState<string|null>(null);
  const [cycleError, setCycleError] = useState<string|null>(null);
  const [targetError, setTargetError] = useState<string|null>(null);

  const doSave = () => {
    const trimmed = name.trim();
    const nErr = trimmed.length < 1 ? 'Name required' : (trimmed.length>40 ? 'Max 40 chars' : null);
    const finalCycle = cycleSize === 0 ? parseInt(customCycle) || 0 : cycleSize;
    const cErr = finalCycle < 1 ? 'Cycle ≥ 1' : null;
    const tNum = Number(target);
    const tErr = Number.isNaN(tNum) || tNum < 0 ? 'Target ≥ 0' : null;
    setNameError(nErr); setCycleError(cErr); setTargetError(tErr);
    if (nErr || cErr || tErr) return;
    onSave({ name: trimmed, color, cycleSize: finalCycle, target: Math.floor(tNum) });
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background">
      <div className="sticky top-0 z-40 -mx-6 px-6 py-4 bg-background border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={onCancel} aria-label="Back"><ChevronLeft/></Button>
        <h1 className="text-xl font-bold text-foreground">Create Counter</h1>
      </div>

      <div className="p-6 pb-24 space-y-4">
        <div>
          <Label htmlFor="cc-name">Mantra/Name</Label>
          <StableInput id="cc-name" value={name} onChange={(v)=>{ setName(v); if(nameError) setNameError(null);} } placeholder="My Practice" maxLength={40} aria-invalid={!!nameError} />
          {nameError && <p className="text-xs text-destructive mt-1">{nameError}</p>}
        </div>

        <div>
          <Label>Accent Color</Label>
          <div className="mt-2">
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger aria-label="Accent color"><SelectValue placeholder="Choose color"/></SelectTrigger>
              <SelectContent>
                {[
                  { label: '🟠 Saffron', value: '#F2994A' },
                  { label: '🟤 Brown', value: '#8B5E3C' },
                  { label: '⚫ Black', value: '#111111' },
                  { label: '⚪ Off‑White', value: '#F2F2F2' },
                  { label: '🔴 Red', value: '#E53935' },
                  { label: '🟢 Green', value: '#34C759' },
                  { label: '🔵 Blue', value: '#007AFF' },
                ].map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: opt.value }} />
                      {opt.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Cycle</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { label: 'Traditional', size: 108, desc: 'counts' },
              { label: 'Half', size: 54, desc: 'counts' },
              { label: 'Quarter', size: 27, desc: 'counts' },
              { label: 'Short', size: 21, desc: 'counts' },
            ].map(opt => (
              <button key={opt.size} type="button" className={cn('p-3 rounded-lg border-2 text-left', cycleSize===opt.size ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')} onClick={()=>{ setCycleSize(opt.size); setCustomCycle(''); if(cycleError) setCycleError(null);} }>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{opt.size}</div>
                    <div className="text-[11px] text-muted-foreground">{opt.label}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{opt.size}</div>
                    <div className="text-[10px] text-muted-foreground">{opt.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div
            className={cn('mt-2 p-3 rounded-lg border-2 transition-opacity motion-safe:duration-150', cycleSize===0 ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/50')}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <button
                  type="button"
                  className="font-semibold text-foreground text-left"
                  onClick={(e)=>{
                    e.preventDefault();
                    setCycleSize(0);
                    if(!customCycle) setCustomCycle('108');
                    setTimeout(()=> document.getElementById('custom-cycle-input')?.focus(), 0);
                  }}
                >
                  Custom
                </button>
                <div className="text-xs text-muted-foreground">Enter your preferred count</div>
              </div>
              {cycleSize===0 && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-9 p-0"
                    onClick={()=>{
                      const v = parseInt(customCycle||'108')||108;
                      const next = Math.max(1, v-1);
                      setCustomCycle(String(next));
                      if (cycleError) setCycleError(null);
                    }}
                    aria-label="Decrease"
                  >−</Button>
                  <NumberField
                    id="custom-cycle-input"
                    value={customCycle === '' ? '' : Number(customCycle)}
                    onChange={(v)=>{
                      const raw = v === '' ? '' : Number(v);
                      if (v === '') { setCustomCycle(''); setCycleError(null); setCycleSize(0); return; }
                      if (raw < 1 || raw > 1000) { setCycleError('Range 1–1000'); setCustomCycle(String(raw)); setCycleSize(0); return; }
                      setCycleError(null);
                      setCustomCycle(String(raw));
                      setCycleSize(0);
                    }}
                    min={1}
                    max={1000}
                    step={1}
                    stepShift={10}
                    autoFocus
                    className="text-center h-9 w-24 rounded-md border border-border bg-card"
                    ariaInvalid={!!cycleError}
                    ariaDescribedby="custom-cycle-help"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-9 p-0"
                    onClick={()=>{
                      const v = parseInt(customCycle||'108')||108;
                      const next = Math.min(1000, v+1);
                      setCustomCycle(String(next));
                      if (cycleError) setCycleError(null);
                    }}
                    aria-label="Increase"
                  >+</Button>
                </div>
              )}
            </div>
            <div id="custom-cycle-help" className="mt-1 text-xs" aria-live="polite">
              {cycleError ? <span className="text-destructive">{cycleError}</span> : <span className="text-muted-foreground">Range 1–1000</span>}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="cc-target">Daily Target (maalas)</Label>
          <div className="mt-2 flex items-center gap-2">
            <Button type="button" variant="outline" className="h-10 w-10 p-0" onClick={()=> setTarget(Math.max(0, target-1))}>-</Button>
            <StableInput id="cc-target" inputMode="numeric" min={0 as any} value={String(target)} onChange={(s)=>{ const v=Math.max(0, Number(s||0)); setTarget(v); if(targetError) setTargetError(null);} } className="w-24 text-center" aria-invalid={!!targetError} />
            <Button type="button" variant="outline" className="h-10 w-10 p-0" onClick={()=> setTarget(Math.max(0, target+1))}>+</Button>
          </div>
          {targetError && <p className="text-xs text-destructive mt-1">{targetError}</p>}
        </div>

        {/* Reminder removed */}

        <Card className="border-primary/20">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Preview</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
              <div className="flex-1">
                <div className="font-semibold text-foreground">{name || 'My Practice'}</div>
                <div className="text-sm text-muted-foreground">{(cycleSize===0 ? (customCycle||'108') : cycleSize)} count cycle • {target} maala{target!==1?'s':''} daily</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1"><X size={16} className="mr-1"/>Cancel</Button>
          <Button onClick={doSave} className="flex-1"><Check size={16} className="mr-1"/>Create Counter</Button>
        </div>
      </div>
    </div>
  );
}
