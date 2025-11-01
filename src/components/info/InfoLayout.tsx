import { ReactNode, useEffect, useRef } from "react";
import { SafeAreaView } from "../SafeAreaView";
import { Header } from "../Header";

interface InfoPageShellProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function InfoPageShell({ title, subtitle, onBack, children }: InfoPageShellProps) {
  const contentPaddingTop = "calc(env(safe-area-inset-top, 0px) + 112px)";
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Ensure the content starts at the top whenever this shell appears
    requestAnimationFrame(() => {
      container.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [title]);

  return (
    <SafeAreaView className="relative flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/10">
      <Header
        title={title}
        subtitle={subtitle}
        showBackButton={Boolean(onBack)}
        onBack={onBack}
      />

      <main className="flex flex-1 flex-col" style={{ paddingTop: contentPaddingTop }}>
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 pb-24 sm:px-6">
          <article className="mx-auto max-w-3xl space-y-8">
            {children}
          </article>
        </div>
      </main>
    </SafeAreaView>
  );
}

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  leading?: ReactNode;
}

export function InfoSection({ title, children, leading }: InfoSectionProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-border/30 bg-card/90 p-4 shadow-sm shadow-gray-100/40 backdrop-blur-sm transition dark:border-border/40 dark:shadow-gray-900/20 sm:p-6">
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-foreground sm:text-lg">{title}</h2>
        {leading && <div className="text-sm leading-relaxed text-muted-foreground">{leading}</div>}
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function InfoArticle({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 text-sm leading-relaxed text-muted-foreground sm:space-y-8">
      {children}
    </div>
  );
}
