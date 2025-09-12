import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
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
  const [name, setName] = useState(editingCounter?.name || '');
  const [color, setColor] = useState(editingCounter?.color || '#F2994A');
  const [cycleSize, setCycleSize] = useState(editingCounter?.cycleSize || 108);
  const [customCycleSize, setCustomCycleSize] = useState('');
  const [target, setTarget] = useState(editingCounter?.target || 1);

  const handleSave = () => {
    const finalCycleSize = cycleSize === 0 ? parseInt(customCycleSize) || 108 : cycleSize;
    
    const newCounter: Counter = {
      id: editingCounter?.id || Date.now().toString(),
      name: name || 'My Practice',
      color,
      cycleSize: finalCycleSize,
      target,
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCounter ? 'Edit Counter' : 'Create Counter'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="counter-name">Mantra/Name</Label>
            <Input
              id="counter-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Practice"
            />
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
            <div className="space-y-2 mt-2">
              {[
                { size: 108, label: '108', desc: 'Traditional full maala' },
                { size: 54, label: '54', desc: 'Half maala' }
              ].map((option) => (
                <button
                  key={option.size}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 text-left transition-all",
                    cycleSize === option.size 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setCycleSize(option.size)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{option.size}</div>
                      <div className="text-xs text-muted-foreground">counts</div>
                    </div>
                  </div>
                </button>
              ))}
              
              <div
                className={cn(
                  "w-full p-3 rounded-lg border-2 transition-all",
                  cycleSize === 0 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <button
                      className="font-semibold text-foreground text-left"
                      onClick={() => setCycleSize(0)}
                    >
                      Custom
                    </button>
                    <div className="text-xs text-muted-foreground">Enter your preferred count</div>
                  </div>
                  <div className="w-20">
                    {cycleSize === 0 && (
                      <Input
                        type="number"
                        value={customCycleSize}
                        onChange={(e) => setCustomCycleSize(e.target.value)}
                        placeholder="108"
                        className="text-center text-sm"
                        min="1"
                        max="1000"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Daily Target (maalas)</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[1, 2, 3, 5].map((targetOption) => (
                <button
                  key={targetOption}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-center",
                    target === targetOption 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setTarget(targetOption)}
                >
                  <div className="font-bold text-foreground">{targetOption}</div>
                  <div className="text-xs text-muted-foreground">maala{targetOption !== 1 ? 's' : ''}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="reminder">Reminder (optional)</Label>
            <Input
              id="reminder"
              type="time"
              defaultValue="09:00"
              className="mt-1"
            />
          </div>

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
      </DialogContent>
    </Dialog>
  );
}