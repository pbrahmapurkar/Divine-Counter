import { useState } from "react";
import { ChevronDown, Coffee, ExternalLink, Wallet } from "lucide-react";
import { InfoPageShell, InfoSection } from "./InfoLayout";
import { Button } from "../ui/button";

interface SupportProjectPageProps {
  onBack: () => void;
  onDonate: () => void;
}

const PAYPAL_URL = "https://paypal.me/PBrahmapurkar";

export function SupportProjectPage({ onBack, onDonate }: SupportProjectPageProps) {
  const [showWhyDonate, setShowWhyDonate] = useState(false);

  const openLink = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <InfoPageShell
      title="Support the Project"
      subtitle="Keep Divine Counter brewing for everyone"
      onBack={onBack}
    >
      <InfoSection
        title="Support Divine Counter"
        leading="I build and maintain this app with care. If it’s useful, you can fuel the work via Buy Me a Coffee or PayPal. Thank you for supporting independent development."
      >
        <div className="space-y-4">
          {/* Buy Me a Coffee Button */}
          <Button
            type="button"
            onClick={onDonate}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 sm:px-5 text-sm font-semibold text-black shadow-[0_14px_28px_-12px_rgba(212,175,55,0.6)] transition-all duration-200 hover:bg-[#caa634] hover:shadow-[0_16px_32px_-12px_rgba(212,175,55,0.7)] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40 focus-visible:ring-offset-2 min-h-[48px]"
          >
            <Coffee className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-center">Support on Buy Me a Coffee</span>
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
          </Button>

          {/* PayPal Donation Button */}
          <Button
            type="button"
            onClick={() => window.open('https://paypal.me/PBrahmapurkar', '_blank', 'noopener,noreferrer')}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 sm:px-5 text-sm font-semibold text-black shadow-[0_14px_28px_-12px_rgba(212,175,55,0.6)] transition-all duration-200 hover:bg-[#caa634] hover:shadow-[0_16px_32px_-12px_rgba(212,175,55,0.7)] focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40 focus-visible:ring-offset-2 min-h-[48px]"
          >
            <Wallet className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-center">Support via PayPal</span>
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <button
              type="button"
              onClick={() => setShowWhyDonate((prev) => !prev)}
              className="inline-flex items-center gap-1 font-medium text-[#D4AF37] transition hover:text-[#caa634]"
            >
              Why donate?
              <ChevronDown
                className={`h-3 w-3 transition-transform ${showWhyDonate ? "rotate-180" : ""}`}
              />
            </button>

            {showWhyDonate && (
              <p>
                Your support covers hosting, design experiments, and the long evenings poured into new
                features. It keeps Divine Counter independent and ad-free.
              </p>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Privacy note —</span> Payments are processed
              by Buy Me a Coffee or PayPal. We don't collect or store your payment info.
            </p>
          </div>
      </InfoSection>
    </InfoPageShell>
  );
}
