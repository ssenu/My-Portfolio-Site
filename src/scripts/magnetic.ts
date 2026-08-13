// 버튼이 근처의 마우스 커서를 살짝 따라오는 마그네틱 효과
// 여러 버튼이 반경 안에 있으면 가장 가까운 하나만 반응한다 (겹침 방지)
export function initMagnetic(els: HTMLElement[], strength = 0.3, radius = 90): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (els.length === 0) return;
  let raf = 0;

  const update = (x: number, y: number) => {
    let best: HTMLElement | null = null;
    let bestD = Infinity, bx = 0, by = 0;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d < radius && d < bestD) {
        best = el; bestD = d; bx = dx; by = dy;
      }
    }
    for (const el of els) {
      if (el === best) {
        el.style.transform = `translate(${bx * strength}px, ${by * strength}px)`;
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
