export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  if (!dialog) return;
  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const triggers = [...document.querySelectorAll<HTMLElement>('[data-lightbox]')];
  let index = 0;

  const show = (i: number) => {
    index = (i + triggers.length) % triggers.length;
    const el = triggers[index];
    img.src = el.dataset.lightbox!;
    img.alt = el.getAttribute('aria-label') ?? '';
  };
  triggers.forEach((el, i) => el.addEventListener('click', () => { show(i); dialog.showModal(); }));
  dialog.querySelector('[data-lb-close]')!.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]')!.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]')!.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // 배경 클릭
}
