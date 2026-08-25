const HASH_PREFIX = '#project-';

// 모달 내 사진 캐러셀: 화살표로 좌우 이동, 끝에서는 화살표 숨김, 점 인디케이터 동기화
function initCarousel(root: HTMLElement): void {
  const car = root.querySelector<HTMLElement>('[data-carousel]');
  if (!car) return;
  const track = car.querySelector<HTMLElement>('[data-track]')!;
  const slides = track.children.length;
  const prev = car.querySelector<HTMLButtonElement>('[data-car-prev]');
  const next = car.querySelector<HTMLButtonElement>('[data-car-next]');
  const dots = [...car.querySelectorAll<HTMLElement>('.pm-dot')];
  if (slides <= 1 || !prev || !next) return;
  let i = 0;

  const render = () => {
    track.style.transform = `translateX(-${i * 100}%)`;
    prev.disabled = i === 0;
    next.disabled = i === slides - 1;
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
  };
  prev.addEventListener('click', () => { if (i > 0) { i--; render(); } });
  next.addEventListener('click', () => { if (i < slides - 1) { i++; render(); } });
  // 키보드 좌우 화살표 (모달이 열려 있는 동안)
  root.closest('dialog')?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && i > 0) { i--; render(); }
    if (e.key === 'ArrowRight' && i < slides - 1) { i++; render(); }
  });
  render();
}

export function initProjectModal(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-project-modal]');
  if (!dialog) return;
  const content = dialog.querySelector<HTMLElement>('[data-pm-content]')!;
  let pushed = false; // 이 모듈이 현재 해시 히스토리 엔트리를 push했는지 여부

  const open = (slug: string, push: boolean) => {
    if (!/^[A-Za-z0-9_-]+$/.test(slug)) { close(false); return; }
    const tpl = document.querySelector<HTMLTemplateElement>(`[data-project-tpl="${slug}"]`);
    if (!tpl) { close(false); return; }
    content.replaceChildren(tpl.content.cloneNode(true));
    initCarousel(content);
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
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    // 패딩/스크롤바 클릭(rect 내부)은 무시하고, 진짜 배경(백드롭) 클릭만 닫기
    const r = dialog.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) close(true);
  });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(true); });
  window.addEventListener('popstate', () => {
    if (location.hash.startsWith(HASH_PREFIX)) open(location.hash.slice(HASH_PREFIX.length), false);
    else { pushed = false; close(false); }
  });

  // 해시 포함 URL 직접 진입
  if (location.hash.startsWith(HASH_PREFIX)) open(location.hash.slice(HASH_PREFIX.length), false);
}
