import { Button } from "./ui/button";
import { Check } from "lucide-react";
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface OnboardingCompleteProps {
  onComplete: () => void;
}

export function OnboardingComplete({ onComplete }: OnboardingCompleteProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        {/* Success Icon with Logo */}
        <div className="relative mb-8 mx-auto">
          <img 
            src={logo} 
            alt="Divine Counter Logo" 
            className="w-24 h-24 mx-auto drop-shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check size={20} className="text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-medium mb-4 text-foreground">All Set!</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Your Divine Counter is ready for your spiritual practice
        </p>
      </div>

      {/* Features highlight */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 bg-[#FF8C42] rounded-full"></div>
          <span>Track your daily progress</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 bg-[#FF8C42] rounded-full"></div>
          <span>Build consistent streaks</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 bg-[#FF8C42] rounded-full"></div>
          <span>Stay focused on your practice</span>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <Button
          onClick={onComplete}
          className="w-full h-12 bg-[#FF8C42] hover:bg-[#E6793A] text-white"
        >
          Start Counting
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 text-sm text-muted-foreground">
        Step 4 of 4
      </div>
    </div>
  );
}