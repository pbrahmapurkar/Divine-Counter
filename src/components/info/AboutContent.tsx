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
        <h1
          className={`font-semibold text-foreground ${
            isPage ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          About Divine Counter
        </h1>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#D4AF37]/80 sm:text-base">
          Sacred Simplicity. Modern Stillness.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Divine Counter is a mindful companion for your daily practice — designed to make every count feel meaningful. Each tap becomes a breath; each session, a moment of calm.
        </p>
      </div>

      <InfoSection title="Mindful by Design">
        <p>
          Created with intention, it blends ancient ritual with modern design — gentle haptics, soft glows, and fluid motion invite focus and presence.
        </p>
        <p>
          Whether you’re reciting mantras, counting breaths, or tracking affirmations, Divine Counter adapts to your rhythm and honors the sacred pace you set.
        </p>
      </InfoSection>

      <InfoSection title="About the Creator">
        <p>
          Pratik Brahmapurkar is a developer and author devoted to mindful design.
        </p>
        <p>
          His work bridges technology and stillness, crafting digital experiences that feel calm, intentional, and soulful.
        </p>
        <p>
          He is the author of{" "}
          <span className="font-semibold text-foreground">
            <span className="italic">Asanas in the Ganges: A Journey of Transformation Through Yoga and Self-Discovery</span>
          </span>
          , a reflection on inner growth and the practice of awareness through movement.
        </p>
        <button
          type="button"
          onClick={() =>
            openLink(
              "https://www.amazon.com/Asanas-Ganges-Journey-Transformation-Self-Discovery-ebook/dp/B0DTKKH4Q1/"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#D4AF37] underline decoration-dotted underline-offset-4 transition hover:text-[#b8902f]"
        >
          <span aria-hidden="true">📖</span>
          <span>Read Asanas in the Ganges on Amazon →</span>
        </button>
      </InfoSection>
    </InfoArticle>
  );
}
