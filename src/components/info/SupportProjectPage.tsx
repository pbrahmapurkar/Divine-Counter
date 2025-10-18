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
          <Button
            type="button"
            onClick={onDonate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black shadow-[0_14px_28px_-12px_rgba(212,175,55,0.6)] transition hover:bg-[#caa634]"
          >
            <Coffee className="h-4 w-4" />
            Support on Buy Me a Coffee
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            onClick={() => openLink(PAYPAL_URL)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003087] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_-18px_rgba(0,48,135,0.7)] transition hover:bg-[#012c74] focus-visible:ring-[#003087]/40"
          >
            <Wallet className="h-4 w-4" />
            Donate with PayPal
            <ExternalLink className="h-4 w-4" />
          </Button>

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
              by Buy Me a Coffee or PayPal. We don’t collect or store your payment info.
            </p>
          </div>
        </div>
      </InfoSection>
    </InfoPageShell>
  );
}
