import * as React from 'react';

type SectionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  active?: boolean;
  title?: React.ReactNode;
  right?: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
};

export function SectionCard({
  active,
  title,
  right,
  icon,
  subtitle,
  className = '',
  children,
  ...rest
}: SectionCardProps) {
  return (
    <section
      className={[
        'rounded-[var(--card-radius)] bg-[var(--card-bg)]',
        'shadow-[var(--card-shadow)] border',
        'border-[var(--card-border)] p-4 sm:p-5',
        active ? 'ring-2 ring-[var(--card-ring)] border-[--dc-saffron]/50' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {(title || right) && (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {icon ? <span className="shrink-0">{icon}</span> : null}
              <h2 className="text-[var(--dc-brown)] text-lg font-semibold truncate">{title}</h2>
            </div>
            {subtitle ? <p className="text-sm opacity-70 mt-1">{subtitle}</p> : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      )}

      <div className={(title || right) ? 'mt-3' : ''}>{children}</div>
    </section>
  );
}
