import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface OnboardingCycleCountProps {
  onNext: (cycleCount: number) => void;
  onBack: () => void;
}

export function OnboardingCycleCount({ onNext, onBack }: OnboardingCycleCountProps) {
  const [selectedCount, setSelectedCount] = useState(108);
  const [customCount, setCustomCount] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const presetCounts = [27, 54, 108, 216];

  const handleNext = () => {
    const count = useCustom ? parseInt(customCount) || 108 : selectedCount;
    onNext(count);
  };

  const handleCustomCountChange = (value: string) => {
    setCustomCount(value);
    if (value && parseInt(value) > 0) {
      setUseCustom(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-6 py-8">
      <div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-4">Choose Cycle Count</h1>
          <p className="text-muted-foreground">
            How many counts make up one cycle?
          </p>
        </div>

        {/* Preset Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {presetCounts.map((count) => (
            <button
              key={count}
              onClick={() => {
                setSelectedCount(count);
                setUseCustom(false);
                setCustomCount("");
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCount === count && !useCustom
                  ? "border-[#FF8C42] bg-[#FFF4F0]"
                  : "border-border hover:border-[#FF8C42]/50"
              }`}
            >
              <div className="text-xl font-medium">{count}</div>
              {count === 108 && (
                <div className="text-xs text-muted-foreground mt-1">Traditional</div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Option */}
        <div className="mb-8">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Or enter a custom count:
          </label>
          <Input
            type="number"
            placeholder="Enter count..."
            value={customCount}
            onChange={(e) => handleCustomCountChange(e.target.value)}
            className={`${
              useCustom ? "border-[#FF8C42] bg-[#FFF4F0]" : ""
            }`}
            min="1"
            max="10000"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleNext}
          className="w-full h-12 bg-[#FF8C42] hover:bg-[#E6793A] text-white"
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
          Step 2 of 4
        </div>
      </div>
    </div>
  );
}
