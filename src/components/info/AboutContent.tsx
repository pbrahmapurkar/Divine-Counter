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
          🌿 About Divine Counter
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          A mindful way to count what truly matters.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Divine Counter brings calm and presence to your daily mantra or mala practice — blending simplicity, soft visuals, and gentle haptics so every count feels sacred and intentional.
        </p>
      </div>

      <InfoSection title="🕊️ How It Works">
        <p className="mb-4">
          Your journey flows through four serene spaces:
        </p>
        <div className="space-y-3">
          <p>
            <span className="font-semibold text-foreground">Home</span> – Begin your practice with quotes and a glowing counting ring that responds to each tap or haptic pulse.
          </p>
          <p>
            <span className="font-semibold text-foreground">Journey</span> – Reflect on your streaks, milestones, and daily progress through simple insights.
          </p>
          <p>
            <span className="font-semibold text-foreground">Counters</span> – Manage multiple practices with custom colors, goals, and sacred symbols.
          </p>
          <p>
            <span className="font-semibold text-foreground">Settings</span> – Adjust reminders, haptics, and privacy-first options.
          </p>
        </div>
        <p className="mt-4 italic text-muted-foreground">
          Each tap — or press of the volume key — becomes a small act of awareness.
        </p>
      </InfoSection>

      <InfoSection title="✨ Rewards & Milestones">
        <p>
          Celebrate consistency with gentle rewards like new themes, symbols, and background patterns that honor your devotion and progress.
        </p>
      </InfoSection>

      <InfoSection title="🧘‍♂️ Your Data, Your Space">
        <p>
          Built with a privacy-first philosophy, Divine Counter stores all data locally.
        </p>
        <p>
          No accounts. No tracking. No distractions — just your practice, protected and personal.
        </p>
      </InfoSection>

      <InfoSection title="💫 About the Creator">
        <p>
          Pratik Brahmapurkar is a certified yoga teacher, author, and mindful technologist whose work bridges ancient wisdom with modern design.
        </p>
        <p>
          He is the author of{" "}
          <span className="font-semibold text-foreground">
            <span className="italic">Asanas in the Ganges: A Journey of Transformation Through Yoga and Self-Discovery</span>
          </span>
          .
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
          <span>Read on Amazon →</span>
        </button>
      </InfoSection>

      <InfoSection title="☕ Support the Journey">
        <p>
          If Divine Counter enriches your practice, support its growth through Buy Me a Coffee or PayPal in Settings → Support.
        </p>
        <p>
          Your contribution keeps it ad-free, offline, and purely mindful.
        </p>
      </InfoSection>
    </InfoArticle>
  );
}

