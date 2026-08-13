// 버튼이 근처의 마우스 커서를 살짝 따라오는 마그네틱 효과
export function initMagnetic(els: HTMLElement[], strength = 0.3, radius = 90): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (els.length === 0) return;
  let raf = 0;

  const update = (x: number, y: number) => {
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d < radius) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else if (el.style.transform) {
        el.style.transform = '';
      }
    }
  };

  window.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      update(e.clientX, e.clientY);
    });
  });
  document.addEventListener('mouseleave', () => update(-9999, -9999));
}
