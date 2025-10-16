import { InfoPageShell } from "./InfoLayout";
import { PrivacyPolicyContent } from "./PrivacyPolicyContent";

interface PrivacyPolicyPageProps {
  onBack?: () => void;
  effectiveDate?: string;
}

export function PrivacyPolicyPage({ onBack, effectiveDate }: PrivacyPolicyPageProps) {
  return (
    <InfoPageShell
      title="Privacy Policy"
      subtitle="How Divine Counter protects your data"
      onBack={onBack}
    >
      <PrivacyPolicyContent effectiveDate={effectiveDate} />
    </InfoPageShell>
  );
}
