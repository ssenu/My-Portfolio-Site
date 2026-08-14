// 제목 글자들이 마우스 커서 주위에서 밀려나는 인터랙션
// 여러 제목에서 호출해도 mousemove 리스너는 하나만 등록된다.
const allChars: HTMLElement[] = [];
let started = false;

export function initCharRepel(root: HTMLElement): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  allChars.push(...root.querySelectorAll<HTMLElement>('.ch'));
  if (started || allChars.length === 0) return;
  started = true;

  const RADIUS = 150; // 반응 반경(px)
  const PUSH = 55;    // 최대 밀림 거리(px)
  let raf = 0;

  const update = (x: number, y: number) => {
    for (const c of allChars) {
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

// 제목 요소의 텍스트를 글자 span(.ch)으로 분해한 뒤 커서 회피를 활성화
export function splitAndRepel(el: HTMLElement): void {
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
  initCharRepel(el);
}
