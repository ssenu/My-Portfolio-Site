export function initReveal(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed', 'reveal-done'));
    return;
  }
  const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target;
      const prev = timers.get(el);
      if (prev !== undefined) clearTimeout(prev);
      if (entry.isIntersecting) {
        el.classList.add('revealed');
        // 최대 stagger 지연(0.4s) + 전환(0.5s) + 여유를 덮은 뒤 entry 전용 스타일 해제
        timers.set(el, setTimeout(() => el.classList.add('reveal-done'), 1200));
      } else {
        // 뷰포트를 완전히 벗어나면 초기화해서 재진입 시(위/아래 어느 방향이든) 다시 등장 모션
        el.classList.remove('revealed', 'reveal-done');
      }
    }
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
