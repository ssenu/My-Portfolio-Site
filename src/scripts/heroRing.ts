import { stepRing, addImpulse, BASE_VELOCITY, type RingState } from '../lib/ringPhysics';

const DEG_PER_PX = 0.35;      // 드래그 감도
const CLICK_THRESHOLD_PX = 5; // 이하 이동이면 클릭으로 판정
const WHEEL_IMPULSE = 0.25;   // 휠 deltaY → 각속도

export function initHeroRing(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('.ring-stage');
  const cards = [...root.querySelectorAll<HTMLElement>('.ring-card')];
  if (!stage || cards.length === 0) return;

  // 카드 원형 배치: 반지름 = 카드폭/2 / tan(π/n) + 40
  const n = cards.length;
  const cardW = cards[0].offsetWidth;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / Math.max(n, 3)) + 40);
  cards.forEach((c, i) => {
    // --lift/--zoom은 CSS hover가 조절 (살짝 떠오르며 포커싱)
    c.style.transform = `translate(-50%, -50%) rotateY(${(360 / n) * i}deg) translateZ(${radius}px) translateY(var(--lift, 0px)) scale(var(--zoom, 1))`;
    c.style.margin = '0';
    c.style.left = '50%'; c.style.top = '50%';
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let base = reduced.matches ? 0 : BASE_VELOCITY;
  reduced.addEventListener('change', () => { base = reduced.matches ? 0 : BASE_VELOCITY; });

  let state: RingState = { angle: 0, velocity: base };
  let dragging = false;
  let lastX = 0, totalMove = 0, lastDx = 0, lastT = 0;

  root.addEventListener('pointerdown', (e) => {
    dragging = true; root.classList.add('dragging');
    lastX = e.clientX; totalMove = 0; lastDx = 0;
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX; totalMove += Math.abs(dx); lastDx = dx;
    state = { ...state, angle: state.angle + dx * DEG_PER_PX };
  });
  root.addEventListener('pointerup', (e) => {
    dragging = false; root.classList.remove('dragging');
    if (totalMove <= CLICK_THRESHOLD_PX) {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.ring-card');
      if (card?.dataset.slug)
        window.dispatchEvent(new CustomEvent('open-project', { detail: { slug: card.dataset.slug } }));
    } else {
      state = { ...state, velocity: lastDx * DEG_PER_PX * 60 }; // 놓는 순간 속도 이어받기
    }
  });
  root.addEventListener('pointercancel', () => {
    dragging = false; root.classList.remove('dragging');
  });
  root.addEventListener('wheel', (e) => {
    state = addImpulse(state, e.deltaY * WHEEL_IMPULSE);
  }, { passive: true });

  // 키보드: 카드 포커스 + Enter → 모달
  cards.forEach((c) => c.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && c.dataset.slug)
      window.dispatchEvent(new CustomEvent('open-project', { detail: { slug: c.dataset.slug } }));
  }));

  const loop = (now: number) => {
    const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
    if (!dragging && !document.hidden) state = stepRing(state, dt, base);
    stage.style.setProperty('--ring-angle', `${state.angle}deg`);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame((t) => { lastT = t; requestAnimationFrame(loop); });
}
