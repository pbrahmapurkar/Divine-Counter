import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { StableInput } from './ui/stable-input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { useIsMobile } from './ui/use-mobile';
import { Switch } from './ui/switch';
import { cn } from './ui/utils';

interface Counter {
  id: string;
  name: string;
  color: string;
  cycleSize: number;
  target: number;
  totalCount: number;
  todayCount: number;
  maalasCompleted: number;
  todayMaalas: number;
  streak: number;
}

interface CreateCounterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (counter: Counter) => void;
  editingCounter?: Counter | null;
}

const colors = [
  { name: 'Saffron', value: '#F2994A' },
  { name: 'Blue', value: '#007AFF' },
  { name: 'Green', value: '#34C759' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Pink', value: '#FF2D92' },
  { name: 'Orange', value: '#FF6B35' }
];

export function CreateCounterDialog({ open, onOpenChange, onSave, editingCounter }: CreateCounterDialogProps) {
  const isMobile = useIsMobile();
  const [name, setName] = useState(editingCounter?.name || '');
  const [color, setColor] = useState(editingCounter?.color || '#34C759');
  const [cycleSize, setCycleSize] = useState(editingCounter?.cycleSize || 108);
  const [customCycleSize, setCustomCycleSize] = useState('');
  const [target, setTarget] = useState(editingCounter?.target || 1);
  // reminders removed

  const [nameError, setNameError] = useState<string | null>(null);
  const [cycleError, setCycleError] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);

  useEffect(() => {
    // Reset errors when dialog opens/closes
    if (!open) {
      setNameError(null); setCycleError(null); setTargetError(null);
    }
  }, [open]);

  const handleSave = () => {
    // Validate
    const trimmed = (name || '').trim();
    const nameErr = trimmed.length < 1 ? 'Name is required.' : (trimmed.length > 40 ? 'Max 40 characters.' : null);
    const finalCycleSize = cycleSize === 0 ? parseInt(customCycleSize) || 0 : cycleSize;
    const cycErr = finalCycleSize < 1 ? 'Cycle must be ≥ 1.' : null;
    const tgtNum = Number(target);
    const tgtErr = !Number.isFinite(tgtNum) || tgtNum < 0 ? 'Target must be ≥ 0.' : null;
    setNameError(nameErr); setCycleError(cycErr); setTargetError(tgtErr);
    if (nameErr || cycErr || tgtErr) return;

    const newCounter: Counter = {
      id: editingCounter?.id || Date.now().toString(),
      name: trimmed || 'My Practice',
      color,
      cycleSize: finalCycleSize,
      target: Math.max(0, Math.floor(tgtNum)),
      totalCount: editingCounter?.totalCount || 0,
      todayCount: editingCounter?.todayCount || 0,
      maalasCompleted: editingCounter?.maalasCompleted || 0,
      todayMaalas: editingCounter?.todayMaalas || 0,
      streak: editingCounter?.streak || 0
    };

    onSave(newCounter);
    onOpenChange(false);
    
    // Reset form
    setName('');
    setColor('#F2994A');
    setCycleSize(108);
    setCustomCycleSize('');
    setTarget(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form
    setName('');
    setColor('#F2994A');
    setCycleSize(108);
    setCustomCycleSize('');
    setTarget(1);
    setReminderEnabled(false);
    setReminderTime('09:00');
    setNameError(null); setCycleError(null); setTargetError(null);
  };

  const FormBody = (
        <>
        <div className="space-y-4">
          <div>
            <Label htmlFor="counter-name">Mantra/Name</Label>
            <StableInput
              id="counter-name"
              value={name}
              onChange={(v) => { setName(v); if (nameError) setNameError(null); }}
              placeholder="My Practice"
              maxLength={40}
              aria-invalid={!!nameError}
            />
            {nameError && <p className="mt-1 text-xs text-destructive" role="alert">{nameError}</p>}
          </div>

          <div>
            <Label>Color/Icon</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all",
                    color === colorOption.value 
                      ? "border-primary" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setColor(colorOption.value)}
                >
                  <div 
                    className="w-6 h-6 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: colorOption.value }}
                  />
                  <div className="text-xs text-muted-foreground">{colorOption.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Cycle Size</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[{ size:108,label:'108',desc:'Traditional' },{ size:54,label:'54',desc:'Half' },{ size:27,label:'27',desc:'Quarter' },{ size:21,label:'21',desc:'Short' }].map(opt => (
                <button key={opt.size} className={cn("p-3 rounded-lg border-2 text-left transition-all", cycleSize===opt.size?"border-primary bg-primary/5":"border-border hover:border-primary/50")}
                        onClick={() => setCycleSize(opt.size)} aria-pressed={cycleSize===opt.size}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{opt.label}</div>
                      <div className="text-[11px] text-muted-foreground">{opt.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{opt.size}</div>
                      <div className="text-[10px] text-muted-foreground">counts</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className={cn("mt-2 p-3 rounded-lg border-2 transition-opacity motion-safe:duration-150", cycleSize===0?"border-primary bg-primary/5":"border-border hover:border-primary/50")}> 
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <button type="button" className="font-semibold text-foreground text-left" onClick={() => { setCycleSize(0); setTimeout(()=>document.getElementById('dialog-custom-cycle')?.focus(),0); }}>Custom</button>
                  <div className="text-xs text-muted-foreground">Enter your preferred count</div>
                </div>
                {cycleSize===0 && (
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" className="h-9 w-9 p-0" onClick={()=>{
                      const v = parseInt(customCycleSize || '108') || 108; setCustomCycleSize(String(Math.max(1, v-1))); if (cycleError) setCycleError(null);
                    }}>−</Button>
                    <StableInput id="dialog-custom-cycle" inputMode="numeric" value={customCycleSize}
                           onChange={(s)=>{ const d=s.replace(/\D/g,'').slice(0,4); setCustomCycleSize(d); if (cycleError) setCycleError(null);} }
                           placeholder="108" className="text-center h-9 w-24" aria-invalid={!!cycleError} />
                    <Button type="button" variant="outline" className="h-9 w-9 p-0" onClick={()=>{
                      const v = parseInt(customCycleSize || '108') || 108; setCustomCycleSize(String(Math.min(1000, v+1))); if (cycleError) setCycleError(null);
                    }}>+</Button>
                  </div>
                )}
              </div>
              {cycleError ? (<p className="mt-1 text-xs text-destructive" role="alert">{cycleError}</p>) : (<p className="mt-1 text-xs text-muted-foreground">Range 1–1000</p>)}
            </div>
          </div>

          <div>
            <Label>Daily Target (maalas)</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {[0,1,2,3,5].map((t) => (
                <button key={t} className={cn("p-3 rounded-lg border-2 transition-colors motion-safe:duration-150 text-center", target===t?"border-primary bg-primary/5":"border-border hover:border-primary/50")}
                        onClick={() => { setTarget(t); if (targetError) setTargetError(null);} }>
                  <div className="font-bold text-foreground">{t}</div>
                  <div className="text-xs text-muted-foreground">maala{t !== 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <StableInput inputMode="numeric" value={String(target)} onChange={(s)=>{ const v=Math.max(0, Number(s||0)); setTarget(v); if (targetError) setTargetError(null);} } className="w-28" aria-invalid={!!targetError} />
              <span className="text-xs text-muted-foreground">Set any number ≥ 0</span>
            </div>
            {targetError && <p className="mt-1 text-xs text-destructive" role="alert">{targetError}</p>}
          </div>

          {/* Reminder removed */}

          {/* Reminder removed */}

          {/* Live Preview */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{name || 'My Practice'}</div>
                  <div className="text-sm text-muted-foreground">
                    {cycleSize === 0 ? (customCycleSize || '108') : cycleSize} count cycle • {target} maala{target !== 1 ? 's' : ''} daily
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            <X size={16} className="mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Check size={16} className="mr-1" />
            {editingCounter ? 'Save Changes' : 'Create Counter'}
          </Button>
        </div>
        </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[80vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{editingCounter ? 'Edit Counter' : 'Create Counter'}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {FormBody}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[85vh] h-[90vh] overflow-y-auto p-4">
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={handleClose} aria-label="Back">
            <ChevronLeft />
          </Button>
          <DialogHeader className="p-0">
            <DialogTitle>{editingCounter ? 'Edit Counter' : 'Create Counter'}</DialogTitle>
          </DialogHeader>
        </div>
        <div className="mt-3">
          {FormBody}
        </div>
      </DialogContent>
    </Dialog>
  );
}
