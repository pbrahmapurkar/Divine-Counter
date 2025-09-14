import * as React from 'react';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onChange?: (v: string) => void;
  onValue?: (v: string) => void; // alias for nicer API in some screens
  deferMs?: number;
};

/**
 * StableInput
 * - Keeps local state fluid for typing
 * - Optionally defers parent updates to reduce re-render churn
 * - Never wrapped in motion; avoid layout animations on its containers
 */
export const StableInput = React.memo(function StableInput({
  value,
  onChange,
  onValue,
  deferMs = 150,
  className,
  ...rest
}: Props) {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => {
    setLocal(value);
  }, [value]);

  React.useEffect(() => {
    const handler = onValue || onChange;
    if (!handler) return;
    const t = window.setTimeout(() => handler(local), deferMs);
    return () => window.clearTimeout(t);
  }, [local, deferMs, onChange, onValue]);

  return (
    <input
      {...rest}
      className={[
        'w-full rounded-xl border px-3 py-3 outline-none',
        'focus:ring-2 focus:ring-[--dc-saffron]',
        className || '',
      ].join(' ')}
      value={local}
      onInput={(e) => setLocal((e.target as HTMLInputElement).value)}
    />
  );
});
