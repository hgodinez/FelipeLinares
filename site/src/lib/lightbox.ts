/**
 * Accessible image viewer. Triggers: any element with [data-lb-open] inside a [data-lb-group].
 * Each trigger carries data-full (large src), data-alt and data-caption.
 * Keyboard: Esc close, ←/→ navigate, +/- or Z zoom. Touch: swipe to navigate, tap to zoom, drag to pan.
 */
type Item = { src: string; alt: string; caption: string };

export function initLightbox() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!dlg || dlg.dataset.ready === '1') return;
  dlg.dataset.ready = '1';

  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const stage = dlg.querySelector<HTMLElement>('[data-lb-stage]')!;
  const counter = dlg.querySelector<HTMLElement>('[data-lb-counter]')!;
  const caption = dlg.querySelector<HTMLElement>('[data-lb-caption]')!;
  const zoomBtn = dlg.querySelector<HTMLButtonElement>('[data-lb-zoom]')!;
  const prevBtn = dlg.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const nextBtn = dlg.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const closeBtn = dlg.querySelector<HTMLButtonElement>('[data-lb-close]')!;

  let items: Item[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;
  let zoomed = false;
  let tx = 0, ty = 0;
  const ofLabel = counter.dataset.of || '/';

  const applyTransform = () => {
    img.style.transform = zoomed ? `translate(${tx}px, ${ty}px) scale(2.2)` : '';
  };
  const setZoom = (on: boolean) => {
    zoomed = on;
    tx = 0; ty = 0;
    stage.classList.toggle('is-zoomed', on);
    zoomBtn.setAttribute('aria-pressed', String(on));
    applyTransform();
  };
  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const it = items[index];
    setZoom(false);
    img.style.opacity = '0';
    img.onload = () => { img.style.opacity = '1'; };
    img.src = it.src;
    img.alt = it.alt;
    caption.textContent = it.caption;
    counter.textContent = items.length > 1 ? `${index + 1} ${ofLabel} ${items.length}` : '';
    prevBtn.hidden = nextBtn.hidden = items.length < 2;
  };
  const open = (group: HTMLElement, trigger: HTMLElement) => {
    const triggers = Array.from(group.querySelectorAll<HTMLElement>('[data-lb-open]'));
    items = triggers.map((el) => ({ src: el.dataset.full || '', alt: el.dataset.alt || '', caption: el.dataset.caption || '' }));
    opener = trigger;
    show(triggers.indexOf(trigger));
    if (!dlg.open) dlg.showModal();
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const close = () => {
    if (dlg.open) dlg.close();
  };
  dlg.addEventListener('close', () => {
    document.body.style.overflow = '';
    img.removeAttribute('src');
    opener?.focus();
  });

  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-lb-open]');
    if (!t) return;
    const group = t.closest<HTMLElement>('[data-lb-group]');
    if (!group) return;
    e.preventDefault();
    open(group, t);
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  zoomBtn.addEventListener('click', () => setZoom(!zoomed));
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    else if (e.key === '+' || e.key === '=' || e.key.toLowerCase() === 'z') { setZoom(!zoomed); }
    else if (e.key === '-') { setZoom(false); }
  });

  // Pointer: tap to zoom, drag to pan when zoomed, horizontal swipe to navigate when not zoomed.
  let startX = 0, startY = 0, lastX = 0, lastY = 0, moved = false, down = false;
  stage.addEventListener('pointerdown', (e) => {
    down = true; moved = false;
    startX = lastX = e.clientX; startY = lastY = e.clientY;
    stage.setPointerCapture(e.pointerId);
    if (zoomed) stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) moved = true;
    if (zoomed) { tx += dx; ty += dy; applyTransform(); }
  });
  stage.addEventListener('pointerup', (e) => {
    down = false;
    stage.classList.remove('is-dragging');
    const dx = e.clientX - startX;
    if (!zoomed && moved && Math.abs(dx) > 50 && items.length > 1) { show(dx < 0 ? index + 1 : index - 1); return; }
    if (!moved) setZoom(!zoomed);
  });
  stage.addEventListener('pointercancel', () => { down = false; stage.classList.remove('is-dragging'); });
}
