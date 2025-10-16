import { InfoArticle, InfoSection } from "./InfoLayout";

const openLink = (url: string) => {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

interface AboutContentProps {
  variant?: "page" | "sheet";
}

export function AboutContent({ variant = "sheet" }: AboutContentProps) {
  const isPage = variant === "page";

  return (
    <InfoArticle>
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]/80 sm:text-sm">
          Sacred Simplicity
        </p>
        <h1
          className={`font-semibold text-foreground ${
            isPage ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          Divine Counter is a mindful sanctuary for your daily practice.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Created with intention by Pratik Brahmapurkar, the experience is designed to blend ancient ritual with modern calm—helping every count feel meaningful.
        </p>
      </div>

      <InfoSection title="A Companion for Spiritual Rhythm">
        <p>
          Every detail in Divine Counter is crafted to reduce friction and invite focus. Gentle haptics, soft glows, and warm gradients encourage you to settle into the practice without distraction.
        </p>
        <p>
          Whether you are reciting mantras, counting breaths, or tracking meditative affirmations, the app adapts to your rhythm and honours the sacred pace you set.
        </p>
      </InfoSection>

      <InfoSection title="About the Creator">
        <p>
          Pratik Brahmapurkar is a developer and author devoted to mindful design. His work strives to offer digital tools that feel soulful—balancing utility with serenity.
        </p>
        <p>
          He is also the author of{" "}
          <button
            type="button"
            onClick={() =>
              openLink(
                "https://www.amazon.com/Asanas-Ganges-Journey-Transformation-Self-Discovery-ebook/dp/B0DTKKH4Q1/"
              )
            }
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[#D4AF37] underline decoration-dotted underline-offset-4 transition hover:text-[#b8902f]"
          >
            <span className="italic">Asanas in the Ganges</span>
          </button>
          , a reflection on yoga as a path of transformation.
        </p>
      </InfoSection>

      <InfoSection title="Connect with Pratik">
        <p>Share reflections, feedback, or ideas—your voice helps shape the journey.</p>
        <div className="space-y-3">
          <ContactItem
            label="Email"
            value="pbrahmapurkar@gmail.com"
            href="mailto:pbrahmapurkar@gmail.com"
          />
          <ContactItem
            label="Instagram"
            value="@mister.pb"
            href="https://instagram.com/mister.pb"
          />
          <ContactItem
            label="Website"
            value="misterpb.in"
            href="https://misterpb.in"
          />
        </div>
      </InfoSection>
    </InfoArticle>
  );
}

interface ContactItemProps {
  label: string;
  value: string;
  href: string;
}

function ContactItem({ label, value, href }: ContactItemProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl border border-border/30 bg-muted/10 px-4 py-3 text-left transition hover:border-[#D4AF37]/40 hover:bg-muted/20 hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
    >
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </a>
  );
}
