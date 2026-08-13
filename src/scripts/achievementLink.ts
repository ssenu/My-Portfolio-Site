// 목록(.ach-item) ↔ 스캔(.ach-scan) 양방향 hover 연동: 같은 data-id에 .is-linked 토글
export function initAchievementLink(section: HTMLElement): void {
  const setLinked = (id: string | null) => {
    section.querySelectorAll<HTMLElement>('[data-id]').forEach((el) => {
      el.classList.toggle('is-linked', id !== null && el.dataset.id === id);
    });
  };
  section.addEventListener('mouseover', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-id]');
    if (el) setLinked(el.dataset.id ?? null);
  });
  section.addEventListener('mouseleave', () => setLinked(null));
}
