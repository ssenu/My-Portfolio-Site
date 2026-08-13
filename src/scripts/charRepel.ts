// 대제목 글자들이 마우스 커서 주위에서 밀려나는 인터랙션
export function initCharRepel(root: HTMLElement): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const chars = [...root.querySelectorAll<HTMLElement>('.ch')];
  if (chars.length === 0) return;

  const RADIUS = 100; // 반응 반경(px)
  const PUSH = 28;    // 최대 밀림 거리(px)
  let raf = 0;

  const update = (x: number, y: number) => {
    for (const c of chars) {
      const r = c.getBoundingClientRect();
      const dx = r.left + r.width / 2 - x;
      const dy = r.top + r.height / 2 - y;
      const d = Math.hypot(dx, dy);
      if (d < RADIUS && d > 0) {
        const f = ((RADIUS - d) / RADIUS) * PUSH;
        c.style.transform = `translate(${(dx / d) * f}px, ${(dy / d) * f}px)`;
      } else if (c.style.transform) {
        c.style.transform = '';
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
