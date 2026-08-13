export function initReveal(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed', 'reveal-done'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // 최대 stagger 지연(0.4s) + 전환(0.5s) + 여유를 덮은 뒤 entry 전용 스타일 해제
        setTimeout(() => entry.target.classList.add('reveal-done'), 1200);
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
