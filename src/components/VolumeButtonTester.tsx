import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface VolumeButtonTesterProps {
  enabled: boolean;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
}

/**
 * Development testing component for volume button simulation
 * Shows on-screen buttons in emulators and web browsers for testing
 * Automatically hides on physical devices where hardware buttons work
 */
export function VolumeButtonTester({ enabled, onVolumeUp, onVolumeDown }: VolumeButtonTesterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Always show test buttons when volume control is enabled
    // This ensures they work in emulators, web browsers, and even physical devices as backup
    setIsVisible(enabled);

    if (enabled) {
      console.log("🧪 VolumeButtonTester: Test buttons are now visible");
      toast.info(
        "🧪 Volume test buttons active! Look for floating buttons or use Arrow Up/Down keys.",
        { duration: 4000 }
      );
    } else {
      console.log("🧪 VolumeButtonTester: Test buttons hidden (volume control disabled)");
    }
  }, [enabled]);

  // Keyboard shortcuts for desktop testing
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Arrow Up = Volume Up
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        console.log("⌨️ Keyboard: Arrow UP pressed - simulating Volume UP");
        onVolumeUp();
        toast.success("🔼 Volume UP (simulated)");
      }
      // Arrow Down = Volume Down
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        console.log("⌨️ Keyboard: Arrow DOWN pressed - simulating Volume DOWN");
        onVolumeDown();
        toast.success("🔽 Volume DOWN (simulated)");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled, onVolumeUp, onVolumeDown]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2">
      {/* Volume UP Button */}
      <button
        onClick={() => {
          console.log("🧪 Test button: Volume UP pressed");
          onVolumeUp();
          toast.success("🔼 Volume UP (simulated)");
        }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-lg hover:bg-[#caa634] active:scale-95 transition-all duration-150"
        aria-label="Simulate Volume Up"
        data-testid="volume-up-test-button"
      >
        <div className="flex flex-col items-center">
          <Volume2 size={20} />
          <span className="text-xs font-semibold mt-0.5">+</span>
        </div>
      </button>

      {/* Volume DOWN Button */}
      <button
        onClick={() => {
          console.log("🧪 Test button: Volume DOWN pressed");
          onVolumeDown();
          toast.success("🔽 Volume DOWN (simulated)");
        }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8B7355] text-white shadow-lg hover:bg-[#7a6449] active:scale-95 transition-all duration-150"
        aria-label="Simulate Volume Down"
        data-testid="volume-down-test-button"
      >
        <div className="flex flex-col items-center">
          <VolumeX size={20} />
          <span className="text-xs font-semibold mt-0.5">-</span>
        </div>
      </button>

      {/* Info Badge */}
      <div className="mt-2 rounded-full bg-black/70 px-3 py-1 text-center">
        <p className="text-xs text-white font-medium">TEST MODE</p>
        <p className="text-[10px] text-white/70">Emulator/Web</p>
      </div>
    </div>
  );
}
