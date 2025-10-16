import { InfoPageShell } from "./InfoLayout";
import { TermsOfServiceContent } from "./TermsOfServiceContent";

interface TermsOfServicePageProps {
  onBack?: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  return (
    <InfoPageShell
      title="Terms of Service"
      subtitle="Guidelines and commitments for using Divine Counter"
      onBack={onBack}
    >
      <TermsOfServiceContent />
    </InfoPageShell>
  );
}
