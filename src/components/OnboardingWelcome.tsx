import { Button } from "./ui/button";
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        {/* App Logo */}
        <div className="mb-8 mx-auto">
          <img 
            src={logo} 
            alt="Divine Counter Logo" 
            className="w-24 h-24 mx-auto drop-shadow-lg"
          />
        </div>
        
        <h1 className="text-3xl font-medium mb-4 text-foreground">Divine Counter</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A mindful companion for your spiritual practice
        </p>
      </div>

      {/* Calming illustration placeholder */}
      <div className="w-64 h-48 bg-gradient-to-b from-[#FFF4F0] to-[#FFE8DC] rounded-2xl mb-12 flex items-center justify-center">
        <div className="text-[#FF8C42] opacity-60">
          <svg width="80" height="80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <Button
          onClick={onNext}
          className="w-full h-12 bg-[#FF8C42] hover:bg-[#E6793A] text-white"
        >
          Get Started
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 text-sm text-muted-foreground">
        Step 1 of 4
      </div>
    </div>
  );
}