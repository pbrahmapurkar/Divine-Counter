import { InfoPageShell } from "./InfoLayout";
import { AboutContent } from "./AboutContent";

interface AboutPageProps {
  onBack?: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <InfoPageShell
      title="About Divine Counter"
      subtitle="A mindful companion crafted by Pratik Brahmapurkar"
      onBack={onBack}
    >
      <AboutContent variant="page" />
    </InfoPageShell>
  );
}
