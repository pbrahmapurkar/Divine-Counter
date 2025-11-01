import { InfoArticle, InfoSection } from "./InfoLayout";

interface PrivacyPolicyContentProps {
  effectiveDate?: string;
}

const DEFAULT_DATE = "September 28, 2025";

export function PrivacyPolicyContent({ effectiveDate = DEFAULT_DATE }: PrivacyPolicyContentProps) {
  return (
    <InfoArticle>
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/80">
          Privacy Promise
        </p>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Your practice stays yours.</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Effective Date: {effectiveDate}
        </p>
      </div>

      <InfoSection title="1. Our Commitment">
        <p>
          Divine Counter is designed as a private sanctuary for your spiritual practice. All personal information and practice data remain solely on your device. We never collect, track, analyze, or sell any user data.
        </p>
      </InfoSection>

      <InfoSection title="2. Information We Handle (Locally Only)">
        <p>The app may store the following information on your device to function properly:</p>
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          <li>Name (if you choose to enter one)</li>
          <li>Practice details such as cycle counts, goals, icons, and themes</li>
          <li>Daily counts and progress history</li>
          <li>Personal journal reflections</li>
          <li>App preferences like haptic settings</li>
        </ul>
        <p>No data is transmitted to any external server or third party. Divine Counter works completely offline.</p>
      </InfoSection>

      <InfoSection title="3. Data Storage & Security">
        <p>Your information is securely stored within your device’s local storage, using the protections provided by your operating system. You remain in complete control of your data at all times.</p>
      </InfoSection>

      <InfoSection title="4. Data Deletion">
        <p>You can reset or clear all data from within the app’s settings at any time.</p>
        <p>Uninstalling Divine Counter permanently deletes all stored information from your device.</p>
      </InfoSection>

      <InfoSection title="5. Children’s Privacy">
        <p>Divine Counter is not intended for children under 13 years of age. We do not knowingly collect or store data from children.</p>
      </InfoSection>

      <InfoSection title="6. Policy Updates">
        <p>This policy may be updated as the app evolves. Any changes will be published within the app, and the effective date above will be updated to reflect the latest version.</p>
      </InfoSection>

      <InfoSection title="7. Contact">
        <p>If you have questions, suggestions, or feedback about privacy, please reach out:</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span aria-hidden="true">📧</span>{" "}
            <a href="mailto:pbrahmapurkar@gmail.com" className="font-medium text-[#D4AF37] hover:text-[#b8902f]">
              Email: pbrahmapurkar@gmail.com
            </a>
          </p>
          <p>
            <span aria-hidden="true">🌐</span>{" "}
            <a href="https://misterpb.in/privacy/divine-counter" target="_blank" rel="noopener noreferrer" className="font-medium text-[#D4AF37] hover:text-[#b8902f]">
              Website: https://misterpb.in/privacy/divine-counter
            </a>
          </p>
        </div>
      </InfoSection>
    </InfoArticle>
  );
}
