import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Counter {
  name: string;
  color: string;
  dailyGoal: number;
}

interface OnboardingCreateCounterProps {
  cycleCount: number;
  onNext: (counter: Counter) => void;
  onBack: () => void;
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

export function OnboardingCreateCounter({ cycleCount, onNext, onBack }: OnboardingCreateCounterProps) {
  const [counter, setCounter] = useState<Counter>({
    name: "",
    color: "#FF8C42",
    dailyGoal: 3
  });

  const handleNext = () => {
    if (counter.name.trim() && counter.dailyGoal > 0) {
      onNext(counter);
    }
  };

  const isValid = counter.name.trim().length > 0 && counter.dailyGoal > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-6 py-8">
      <div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-4">Create Counter</h1>
          <p className="text-muted-foreground">
            Set up your first mantra counter
          </p>
        </div>

        <div className="space-y-6">
          {/* Counter Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium mb-2 block">
              Mantra Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Om Mani Padme Hum"
              value={counter.name}
              onChange={(e) => setCounter({ ...counter, name: e.target.value })}
              className="w-full"
            />
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
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    counter.color === color
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Daily Goal */}
          <div>
            <Label htmlFor="goal" className="text-sm font-medium mb-2 block">
              Daily Goal (malas per day)
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

          {/* Preview */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Preview:</div>
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: counter.color }}
              />
              <div>
                <div className="font-medium">
                  {counter.name || "Mantra Name"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {cycleCount} count • Goal: {counter.dailyGoal}/day
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="w-full h-12 bg-[#FF8C42] hover:bg-[#E6793A] text-white disabled:opacity-50"
        >
          Continue
        </Button>
        
        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full h-12"
        >
          Back
        </Button>

        {/* Progress indicator */}
        <div className="text-center text-sm text-muted-foreground">
          Step 3 of 4
        </div>
      </div>
    </div>
  );
}