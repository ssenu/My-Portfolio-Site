// 방문 카운터: 같은 컨테이너의 /api/visits 사용.
// 페이지가 열릴 때마다(새로고침 포함) +1 — 접속 누적 수 그대로 표시.
// API가 없으면(dev 서버 등) 요소를 숨긴 채로 둔다.
export function initVisits(): void {
  const box = document.querySelector<HTMLElement>('[data-visits]');
  const num = document.querySelector<HTMLElement>('[data-visits-count]');
  if (!box || !num) return;

  fetch('/api/visits', { method: 'POST' })
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<{ count: number }>;
    })
    .then(({ count }) => {
      box.hidden = false;
      // 숫자가 차오르는 짧은 연출 (reduced-motion이면 즉시 표시)
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || count < 10) {
        num.textContent = count.toLocaleString();
        return;
      }
      const start = performance.now();
      const dur = 900;
      const tick = (t: number) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        num.textContent = Math.round(count * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    })
    .catch(() => {
      /* API 없음(dev)·오류 시 표시 안 함 */
    });
}
