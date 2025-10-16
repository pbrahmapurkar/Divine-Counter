import { InfoArticle, InfoSection } from "./InfoLayout";

export function TermsOfServiceContent() {
  return (
    <InfoArticle>
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]/80">
          Terms of Practice
        </p>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Please read carefully before using Divine Counter.
        </h1>
      </div>

      <InfoSection title="1. Agreement to Terms">
        <p>
          By downloading or using Divine Counter, you agree to these Terms of Service. If you do not agree, please discontinue using the app.
        </p>
      </InfoSection>

      <InfoSection title="2. Purpose of the App">
        <p>
          Divine Counter is intended to support personal meditation, mantra, and spiritual practices. You agree to use the app only for lawful, mindful, and intended purposes.
        </p>
      </InfoSection>

      <InfoSection title="3. User Data">
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          <li>You retain ownership of all practice data, counts, and journal entries you create.</li>
          <li>All data is stored locally on your device.</li>
          <li>You are responsible for managing, exporting, or deleting your personal records.</li>
        </ul>
      </InfoSection>

      <InfoSection title="4. Intellectual Property">
        <p>
          All design elements, features, and content of Divine Counter remain the exclusive property of Pratik Brahmapurkar. You may not reproduce or resell the app or its materials.
        </p>
      </InfoSection>

      <InfoSection title="5. Disclaimer of Warranties">
        <p>
          Divine Counter is provided “as is.” While we aim to deliver a serene experience, we do not guarantee uninterrupted operation or error-free performance. Regularly export or back up any data you wish to preserve.
        </p>
      </InfoSection>

      <InfoSection title="6. Limitation of Liability">
        <p>
          The developer is not liable for indirect or consequential damages, including loss of data or practice interruptions arising from use of the app.
        </p>
      </InfoSection>

      <InfoSection title="7. Changes to Terms">
        <p>
          These Terms may be updated as Divine Counter evolves. Updates will be reflected within the app, and the effective date will indicate the latest revision.
        </p>
      </InfoSection>

      <InfoSection title="8. Contact">
        <p>
          For questions or feedback about these Terms, connect with Pratik:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          <li>Email: <a href="mailto:pbrahmapurkar@gmail.com" className="text-[#D4AF37] hover:text-[#b8902f]">pbrahmapurkar@gmail.com</a></li>
          <li>Instagram: <a href="https://instagram.com/mister.pb" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#b8902f]">@mister.pb</a></li>
          <li>Website: <a href="https://misterpb.in" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#b8902f]">misterpb.in</a></li>
        </ul>
      </InfoSection>
    </InfoArticle>
  );
}
