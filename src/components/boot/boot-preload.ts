export function preloadBootAssets(){
  const imgs = ['/assets/logo-mark.svg', '/assets/brand-wordmark.svg'];
  imgs.forEach(src => { const i = new Image(); i.src = src; });
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Lightweight warm up
    }, { timeout: 800 });
  }
}

