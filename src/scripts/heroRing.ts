import { stepRing, addImpulse, BASE_VELOCITY, type RingState } from '../lib/ringPhysics';

const DEG_PER_PX = 0.35;      // 드래그 감도
const CLICK_THRESHOLD_PX = 5; // 이하 이동이면 클릭으로 판정
const WHEEL_IMPULSE = 0.25;   // 휠 deltaY → 각속도
const REPEL_RADIUS = 170;     // 커서 반응 반경(px)
const REPEL_PUSH = 48;        // 최대 밀림 거리(px)
const REPEL_MAX_DEG = 16;     // 각도 밀림 상한(deg)
const REPEL_EASE = 0.16;      // 제자리 복귀 감쇠

export function initHeroRing(root: HTMLElement): void {
  const stage = root.querySelector<HTMLElement>('.ring-stage');
  const cards = [...root.querySelectorAll<HTMLElement>('.ring-card')];
  if (!stage || cards.length === 0) return;

  // 카드 원형 배치: 반지름 = 카드폭/2 / tan(π/n) + 40
  const n = cards.length;
  const cardW = cards[0].offsetWidth;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / Math.max(n, 3)) + 40);
  cards.forEach((c, i) => {
    c.style.transform = `translate(-50%, -50%) rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`;
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

  // 커서 회피: 회전 중 커서 근처를 지나는 카드가 살짝 밀려났다가 복귀
  let mx = -1e4, my = -1e4;
  root.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  root.addEventListener('mouseleave', () => { mx = -1e4; my = -1e4; });
  const offsets = cards.map(() => ({ y: 0, a: 0, active: false }));
  const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v));

  const applyRepel = () => {
    cards.forEach((c, i) => {
      const o = offsets[i];
      let ty = 0, ta = 0;
      if (!dragging && mx > -1e3) {
        const r = c.getBoundingClientRect();
        const dx = r.left + r.width / 2 - mx;
        const dy = r.top + r.height / 2 - my;
        const d = Math.hypot(dx, dy);
        if (d < REPEL_RADIUS && d > 0) {
          const f = ((REPEL_RADIUS - d) / REPEL_RADIUS) * REPEL_PUSH;
          // 수평 밀림은 링 궤도 위 각도 오프셋으로 변환 (화면 dx/dθ = r·cosθ 보정)
          const theta = ((state.angle + (360 / n) * i) * Math.PI) / 180;
          const cos = Math.cos(theta);
          const cosC = (cos < 0 ? -1 : 1) * Math.max(Math.abs(cos), 0.35);
          ta = clamp((((dx / d) * f) / (radius * cosC)) * (180 / Math.PI), REPEL_MAX_DEG);
          ty = (dy / d) * f;
        }
      }
      o.a += (ta - o.a) * REPEL_EASE;
      o.y += (ty - o.y) * REPEL_EASE;
      const moving = Math.abs(o.a) > 0.02 || Math.abs(o.y) > 0.05;
      if (moving) {
        c.style.transform = `translate(-50%, -50%) translateY(${o.y}px) rotateY(${(360 / n) * i + o.a}deg) translateZ(${radius}px)`;
        o.active = true;
      } else if (o.active) {
        c.style.transform = `translate(-50%, -50%) rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`;
        o.active = false; o.a = 0; o.y = 0;
      }
    });
  };

  const reducedRepel = () => reduced.matches;
  const loop = (now: number) => {
    const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
    if (!dragging && !document.hidden) state = stepRing(state, dt, base);
    stage.style.setProperty('--ring-angle', `${state.angle}deg`);
    if (!reducedRepel() && !document.hidden) applyRepel();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame((t) => { lastT = t; requestAnimationFrame(loop); });
}
