const HASH_PREFIX = '#project-';

export function initProjectModal(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-project-modal]');
  if (!dialog) return;
  const content = dialog.querySelector<HTMLElement>('[data-pm-content]')!;
  let pushed = false; // 이 모듈이 현재 해시 히스토리 엔트리를 push했는지 여부

  const open = (slug: string, push: boolean) => {
    const tpl = document.querySelector<HTMLTemplateElement>(`[data-project-tpl="${slug}"]`);
    if (!tpl) return;
    content.replaceChildren(tpl.content.cloneNode(true));
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (push) {
      if (location.hash !== HASH_PREFIX + slug) {
        history.pushState(null, '', HASH_PREFIX + slug);
        pushed = true;
      }
    } else {
      pushed = false;
    }
  };
  const close = (back: boolean) => {
    if (dialog.open) dialog.close();
    document.body.style.overflow = '';
    if (back && location.hash.startsWith(HASH_PREFIX)) {
      if (pushed) {
        history.back(); // popstate가 pushed를 리셋하며 동기화
      } else {
        // 직접 진입: 뒤로가기 대신 해시만 제거 (사이트 이탈 방지)
        history.replaceState(null, '', location.pathname + location.search);
      }
    }
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
    else { pushed = false; close(false); }
  });

  // 해시 포함 URL 직접 진입
  if (location.hash.startsWith(HASH_PREFIX)) open(location.hash.slice(HASH_PREFIX.length), false);
}
