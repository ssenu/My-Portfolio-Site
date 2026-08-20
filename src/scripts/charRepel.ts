// 제목 글자들이 마우스 커서 주위에서 밀려나는 인터랙션
// 여러 제목에서 호출해도 mousemove 리스너는 하나만 등록된다.
// 강도는 호출부에서 조절: 기본은 은은하게, 히어로 타이틀만 강하게.
interface CharEntry { el: HTMLElement; radius: number; push: number }
export interface RepelOptions { radius?: number; push?: number }
const allChars: CharEntry[] = [];
let started = false;

export function initCharRepel(root: HTMLElement, opts: RepelOptions = {}): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const radius = opts.radius ?? 110; // 기본 반응 반경(px)
  const push = opts.push ?? 26;     // 기본 최대 밀림 거리(px)
  root.querySelectorAll<HTMLElement>('.ch').forEach((el) =>
    allChars.push({ el, radius, push }));
  if (started || allChars.length === 0) return;
  started = true;

  let raf = 0;

  const update = (x: number, y: number) => {
    for (const c of allChars) {
      const r = c.el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - x;
      const dy = r.top + r.height / 2 - y;
      const d = Math.hypot(dx, dy);
      if (d < c.radius && d > 0) {
        const f = ((c.radius - d) / c.radius) * c.push;
        c.el.style.transform = `translate(${(dx / d) * f}px, ${(dy / d) * f}px)`;
      } else if (c.el.style.transform) {
        c.el.style.transform = '';
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

  // 터치: 손가락을 누른 채 움직이면 그 지점이 커서 역할 (스크롤은 막지 않음, passive)
  const onTouch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    const x = t.clientX, y = t.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; update(x, y); });
  };
  window.addEventListener('touchstart', onTouch, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  // 손가락을 떼면 글자들이 제자리로 복귀
  const release = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } update(-9999, -9999); };
  window.addEventListener('touchend', release, { passive: true });
  window.addEventListener('touchcancel', release, { passive: true });
}

// 제목 요소의 텍스트를 글자 span(.ch)으로 분해한 뒤 커서 회피를 활성화
export function splitAndRepel(el: HTMLElement, opts: RepelOptions = {}): void {
  const text = (el.textContent ?? '').trim();
  if (!text) return;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  for (const ch of text) {
    const s = document.createElement('span');
    s.className = 'ch';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(s);
  }
  initCharRepel(el, opts);
}
