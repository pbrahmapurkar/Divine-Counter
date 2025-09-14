import * as React from 'react';

export function PillButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>){
  const { className='', ...rest } = props;
  return (
    <button
      className={[
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        'bg-[--dc-saffron] text-white font-medium',
        'shadow-sm hover:brightness-[1.02] active:brightness-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[--dc-gold]',
        className,
      ].join(' ')}
      {...rest}
    />
  );
}

