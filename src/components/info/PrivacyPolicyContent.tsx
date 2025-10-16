import { InfoArticle, InfoSection } from "./InfoLayout";

interface PrivacyPolicyContentProps {
  effectiveDate?: string;
}

const DEFAULT_DATE = "September 28, 2025";

export function PrivacyPolicyContent({ effectiveDate = DEFAULT_DATE }: PrivacyPolicyContentProps) {
  return (
    <InfoArticle>
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/80">
          Privacy Promise
        </p>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Your practice stays yours.</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Effective Date · {effectiveDate}
        </p>
      </div>

      <InfoSection title="1. Our Privacy Promise">
        <p>
          Divine Counter is designed as a private sanctuary for your spiritual practice. All personal information and practice data remain on your device. We never collect, track, or sell your data.
        </p>
      </InfoSection>

      <InfoSection title="2. Information We Handle">
        <p>The app may store the following, strictly on your device:</p>
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          <li>Your name (if provided)</li>
          <li>Practice details such as cycle counts, goals, icons, and themes</li>
          <li>Daily counts and progress history</li>
          <li>Personal journal reflections</li>
          <li>App preferences like haptic settings</li>
        </ul>
        <p>None of this information is transmitted to servers or third parties. Divine Counter works fully offline.</p>
      </InfoSection>

      <InfoSection title="3. Data Storage">
        <p>Your practice information is saved securely within the device storage mechanisms provided by your operating system. You remain in full control of what stays or goes.</p>
      </InfoSection>

      <InfoSection title="4. Data Deletion">
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          <li>Reset your data anytime from the settings screen.</li>
          <li>Uninstalling Divine Counter removes all associated data from your device.</li>
        </ul>
      </InfoSection>

      <InfoSection title="5. Children’s Privacy">
        <p>Divine Counter is not intended for children under 13 years of age, and we do not knowingly collect information from children.</p>
      </InfoSection>

      <InfoSection title="6. Updates to This Policy">
        <p>
          As the app evolves, this policy may be updated. Changes will be published within the app, and the effective date above will reflect the latest version.
        </p>
      </InfoSection>

      <InfoSection title="7. Contact">
        <p>If you have questions or would like to share feedback regarding privacy, connect with Pratik:</p>
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          <li>Email: <a href="mailto:pbrahmapurkar@gmail.com" className="text-[#D4AF37] hover:text-[#b8902f]">pbrahmapurkar@gmail.com</a></li>
          <li>Instagram: <a href="https://instagram.com/mister.pb" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#b8902f]">@mister.pb</a></li>
          <li>Website: <a href="https://misterpb.in" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#b8902f]">misterpb.in</a></li>
        </ul>
      </InfoSection>
    </InfoArticle>
  );
}
