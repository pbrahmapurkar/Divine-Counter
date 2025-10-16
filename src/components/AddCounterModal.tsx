import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sun, Moon, Star, Flower, Triangle, Circle, Heart, Zap, ChevronLeft } from "lucide-react";
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';
import { Switch } from "./ui/switch";

interface Counter {
  name: string;
  color: string;
  cycleCount: number;
  dailyGoal: number;
  icon?: string;
  reminderEnabled: boolean;
  reminderTime: string;
}

interface AddCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (counter: Counter) => void;
}

const presetColors = [
  "#FF8C42", // Saffron
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#9C27B0", // Purple
  "#F44336", // Red
  "#FF9800", // Orange
  "#607D8B", // Blue Grey
  "#795548"  // Brown
];

const presetCycles = [27, 54, 108, 216];

const presetIcons = [
  { key: "lotus", component: Flower, label: "Lotus" },
  { key: "sun", component: Sun, label: "Sun" },
  { key: "moon", component: Moon, label: "Moon" },
  { key: "star", component: Star, label: "Star" },
  { key: "heart", component: Heart, label: "Heart" },
  { key: "triangle", component: Triangle, label: "Triangle" },
  { key: "circle", component: Circle, label: "Circle" },
  { key: "mandala", component: Zap, label: "Mandala" },
];

export function AddCounterModal({ isOpen, onClose, onAdd }: AddCounterModalProps) {
  const [counter, setCounter] = useState<Counter>({
    name: "",
    color: "#FF8C42",
    cycleCount: 108,
    dailyGoal: 3,
    icon: "lotus",
    reminderEnabled: false,
    reminderTime: "09:00"
  });

  const [customCycle, setCustomCycle] = useState("");
  const [useCustomCycle, setUseCustomCycle] = useState(false);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  const formatReminderTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    if (hours === undefined || minutes === undefined) return "09:00 AM";
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return "09:00 AM";
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = ((hour + 11) % 12) + 1;
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  const openTimePicker = () => {
    const node = timeInputRef.current;
    if (!node) return;
    const showPicker = (node as any).showPicker;
    if (typeof showPicker === 'function') {
      showPicker.call(node);
    } else {
      node.focus();
      node.click();
    }
  };

  const handleAdd = () => {
    if (counter.name.trim() && counter.dailyGoal > 0) {
      const cycleCount = useCustomCycle ? parseInt(customCycle) || 108 : counter.cycleCount;
      onAdd({ ...counter, cycleCount });
      handleClose();
    }
  };

  const handleClose = () => {
    setCounter({
      name: "",
      color: "#FF8C42",
      cycleCount: 108,
      dailyGoal: 3,
      icon: "lotus",
      reminderEnabled: false,
      reminderTime: "09:00"
    });
    setCustomCycle("");
    setUseCustomCycle(false);
    onClose();
  };

  const handleCustomCycleChange = (value: string) => {
    setCustomCycle(value);
    if (value && parseInt(value) > 0) {
      setUseCustomCycle(true);
    }
  };

  const isValid = counter.name.trim().length > 0 && counter.dailyGoal > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Divine Counter Logo" 
                className="w-6 h-6"
              />
              <DialogTitle>Add New Practice</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2 hover:bg-muted/50"
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
          <DialogDescription>
            Create a new spiritual practice with your preferred personal symbol, cycle count, color, and daily intention.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Counter Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium mb-2 block">
              Practice Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Morning Gratitude, Om Mani Padme Hum"
              value={counter.name}
              onChange={(e) => setCounter({ ...counter, name: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Personal Symbol
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {presetIcons.map((icon) => {
                const IconComponent = icon.component;
                return (
                  <button
                    key={icon.key}
                    onClick={() => setCounter({ ...counter, icon: icon.key })}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                      counter.icon === icon.key
                        ? "border-saffron bg-saffron/10"
                        : "border-border hover:border-saffron/50"
                    }`}
                  >
                    <IconComponent 
                      size={20} 
                      className={counter.icon === icon.key ? "text-saffron" : "text-muted-foreground"}
                    />
                    <span className={`text-xs ${
                      counter.icon === icon.key ? "text-saffron" : "text-muted-foreground"
                    }`}>
                      {icon.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Choose Color
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCounter({ ...counter, color })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    counter.color === color
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Cycle Count */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Cycle Count
            </Label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {presetCycles.map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => {
                    setCounter({ ...counter, cycleCount: cycle });
                    setUseCustomCycle(false);
                    setCustomCycle("");
                  }}
                  className={`p-2 rounded border text-sm transition-all ${
                    counter.cycleCount === cycle && !useCustomCycle
                      ? "border-[#FF8C42] bg-[#FFF4F0]"
                      : "border-border hover:border-[#FF8C42]/50"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom count..."
              value={customCycle}
              onChange={(e) => handleCustomCycleChange(e.target.value)}
              className={`text-sm ${
                useCustomCycle ? "border-[#FF8C42] bg-[#FFF4F0]" : ""
              }`}
              min="1"
              max="10000"
            />
          </div>

          {/* Daily Goal */}
          <div>
            <Label htmlFor="goal" className="text-sm font-medium mb-2 block">
              Daily Intention (cycles per day)
            </Label>
            <Input
              id="goal"
              type="number"
              placeholder="3"
              value={counter.dailyGoal}
              onChange={(e) => setCounter({ ...counter, dailyGoal: parseInt(e.target.value) || 0 })}
              className="w-full"
              min="1"
              max="20"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium block">Daily Reminder</Label>
                <p className="text-xs text-muted-foreground">Receive a gentle prompt at your chosen time.</p>
              </div>
              <Switch
                checked={counter.reminderEnabled}
                onCheckedChange={(value) => setCounter(prev => ({ ...prev, reminderEnabled: value }))}
                aria-label="Toggle daily reminder"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (!counter.reminderEnabled) return;
                openTimePicker();
              }}
              disabled={!counter.reminderEnabled}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
                counter.reminderEnabled
                  ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm'
                  : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="text-sm font-medium">Remind me at</span>
              <span className="text-sm font-semibold">{formatReminderTime(counter.reminderTime)}</span>
            </button>
            <input
              ref={timeInputRef}
              type="time"
              value={counter.reminderTime}
              onChange={(event) => setCounter(prev => ({ ...prev, reminderTime: event.target.value || "09:00" }))}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!isValid}
            className="flex-1 bg-[#FF8C42] hover:bg-[#E6793A] text-white disabled:opacity-50"
          >
            Add Practice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
