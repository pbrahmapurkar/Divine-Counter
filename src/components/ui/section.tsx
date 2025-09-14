import { cn } from "./utils";

type SectionProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, description, icon, children, className }: SectionProps) {
  return (
    <section className={cn("rounded-2xl border bg-card shadow-sm p-5", className)}>
      <header className="flex items-center gap-2 mb-3">
        {icon && <span aria-hidden>{icon}</span>}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </header>
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

