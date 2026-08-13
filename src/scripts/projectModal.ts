const HASH_PREFIX = '#project-';

export function initProjectModal(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-project-modal]');
  if (!dialog) return;
  const content = dialog.querySelector<HTMLElement>('[data-pm-content]')!;

  const open = (slug: string, push: boolean) => {
    const tpl = document.querySelector<HTMLTemplateElement>(`[data-project-tpl="${slug}"]`);
    if (!tpl) return;
    content.replaceChildren(tpl.content.cloneNode(true));
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (push && location.hash !== HASH_PREFIX + slug)
      history.pushState(null, '', HASH_PREFIX + slug);
  };
  const close = (back: boolean) => {
    if (dialog.open) dialog.close();
    document.body.style.overflow = '';
    if (back && location.hash.startsWith(HASH_PREFIX)) history.back();
  };

  // 카드 클릭 / 히어로 링의 open-project 이벤트
  document.querySelectorAll<HTMLElement>('.project-card[data-slug]').forEach((card) =>
    card.addEventListener('click', () => open(card.dataset.slug!, true)));
  window.addEventListener('open-project', ((e: CustomEvent<{ slug: string }>) =>
    open(e.detail.slug, true)) as EventListener);

  // 닫기: ×, 배경, ESC(cancel), 뒤로가기(popstate)
  dialog.querySelector('[data-pm-close]')!.addEventListener('click', () => close(true));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(true); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(true); });
  window.addEventListener('popstate', () => {
    if (location.hash.startsWith(HASH_PREFIX)) open(location.hash.slice(HASH_PREFIX.length), false);
    else close(false);
  });

  // 해시 포함 URL 직접 진입
  if (location.hash.startsWith(HASH_PREFIX)) open(location.hash.slice(HASH_PREFIX.length), false);
}
