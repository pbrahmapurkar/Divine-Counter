import * as React from 'react';

export function SettingRow({ label, hint, control }: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  control: React.ReactNode;
}){
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <div className="text-[var(--dc-brown)] font-medium">{label}</div>
        {hint ? <div className="text-sm opacity-70">{hint}</div> : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

