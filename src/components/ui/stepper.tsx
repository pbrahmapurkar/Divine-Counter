import * as React from 'react';

export function Stepper({ value, min, max, onChange }:{ value: number; min: number; max: number; onChange: (v:number)=>void; }){
  const clamp = (n:number)=> Math.min(max, Math.max(min, n));
  const hold = (delta:number) => {
    let v = value;
    onChange(clamp(v + delta));
    let d = 250;
    let timer: any;
    const tick = () => {
      v = clamp(v + delta);
      onChange(v);
      d = Math.max(60, d - 30);
      timer = setTimeout(tick, d);
    };
    timer = setTimeout(tick, d);
    return () => clearTimeout(timer);
  };
  return (
    <div className="grid grid-cols-[48px_1fr_48px] gap-2 items-center">
      <button
        type="button" aria-label="Decrease"
        className="h-12 rounded-2xl border text-xl"
        onMouseDown={(e)=> { e.preventDefault(); const stop=hold(-1); const up=()=>{stop(); window.removeEventListener('mouseup', up)}; window.addEventListener('mouseup', up); }}
        onTouchStart={(e)=> { e.preventDefault(); const stop=hold(-1); const end=()=>{stop(); window.removeEventListener('touchend', end)}; window.addEventListener('touchend', end); }}
        onClick={()=> onChange(clamp(value-1))}
      >−</button>
      <div className="h-12 rounded-2xl border flex items-center justify-center text-lg font-medium">{value}</div>
      <button
        type="button" aria-label="Increase"
        className="h-12 rounded-2xl border text-xl"
        onMouseDown={(e)=> { e.preventDefault(); const stop=hold(1); const up=()=>{stop(); window.removeEventListener('mouseup', up)}; window.addEventListener('mouseup', up); }}
        onTouchStart={(e)=> { e.preventDefault(); const stop=hold(1); const end=()=>{stop(); window.removeEventListener('touchend', end)}; window.addEventListener('touchend', end); }}
        onClick={()=> onChange(clamp(value+1))}
      >＋</button>
    </div>
  );
}
