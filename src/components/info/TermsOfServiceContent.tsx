import { InfoArticle, InfoSection } from "./InfoLayout";

export function TermsOfServiceContent() {
  return (
    <InfoArticle>
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/80">
          Terms of Practice
        </p>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Please read carefully before using Divine Counter.
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Effective Date: September 28, 2025
        </p>
      </div>

      <InfoSection title="1. Agreement to Terms">
        <p>
          By downloading or using Divine Counter, you agree to abide by these Terms of Practice. If you do not agree, please discontinue use of the app.
        </p>
      </InfoSection>

      <InfoSection title="2. Purpose of the App">
        <p>
          Divine Counter is created to support personal meditation, mantra recitation, and spiritual reflection. You agree to use the app only for lawful, mindful, and intended purposes. The app is not a substitute for medical or therapeutic treatment.
        </p>
      </InfoSection>

      <InfoSection title="3. Ownership and Data Responsibility">
        <p>You retain full ownership of all data you create, including counts, goals, and journal reflections.</p>
        <p>All information is stored locally on your device.</p>
        <p>You are responsible for managing, exporting, or deleting your personal data as you see fit.</p>
      </InfoSection>

      <InfoSection title="4. Intellectual Property">
        <p>
          All design elements, features, branding, and written content within Divine Counter are the exclusive property of Pratik Brahmapurkar. You may not copy, modify, distribute, or resell any part of the app or its materials without prior written permission.
        </p>
      </InfoSection>

      <InfoSection title="5. Disclaimer of Warranties">
        <p>
          Divine Counter is provided “as is” for personal, non-commercial use. While every effort is made to ensure stability and a serene experience, no guarantee is made regarding uninterrupted operation or error-free performance. It is recommended that you regularly export or record any information you wish to preserve.
        </p>
      </InfoSection>

      <InfoSection title="6. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, the developer shall not be liable for any indirect, incidental, or consequential damages — including loss of data, device issues, or practice interruptions — arising from use or inability to use the app.
        </p>
      </InfoSection>

      <InfoSection title="7. Updates to Terms">
        <p>
          These Terms may be updated as Divine Counter evolves. Updates will be reflected within the app, and the Effective Date above will indicate the latest version. Continued use after an update means you accept the revised Terms.
        </p>
      </InfoSection>

      <InfoSection title="8. Contact">
        <p>
          For questions, feedback, or permissions, please contact:
        </p>
        <p className="text-sm text-muted-foreground">
          <span aria-hidden="true">📧</span>{" "}
          <a href="mailto:pbrahmapurkar@gmail.com" className="font-medium text-[#D4AF37] hover:text-[#b8902f]">
            Email: pbrahmapurkar@gmail.com
          </a>
        </p>
      </InfoSection>
    </InfoArticle>
  );
}
