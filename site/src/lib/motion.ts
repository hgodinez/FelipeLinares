/**
 * Movimiento (mejora progresiva).
 * - [data-reveal]      aparece al entrar en el viewport (clase .visible); los hijos con --i se escalonan.
 * - [data-tilt]        se inclina levemente hacia el puntero (solo con puntero fino).
 * - [data-parallax]    se desplaza con el puntero según su factor (p. ej. 0.03).
 * - [data-contar]      cuenta de 0 al número que contiene.
 * Con prefers-reduced-motion todo se muestra en su estado final y no se anima.
 */
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(pointer: fine)').matches;

function initReveal() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)'));
  if (!els.length) return;
  if (reduce() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { const el = e.target as HTMLElement; io.unobserve(el); requestAnimationFrame(() => el.classList.add('visible')); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // Forzar un cálculo de estilos para que el estado oculto exista antes de revelar
  void document.body.offsetHeight;
  els.forEach((el) => io.observe(el));
}

function initTilt() {
  if (reduce() || !finePointer()) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]:not([data-tilt-ready])').forEach((el) => {
    el.dataset.tiltReady = '1';
    const max = Number(el.dataset.tilt) || 6;
    let raf = 0;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    });
    el.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
}

function initParallax() {
  if (reduce() || !finePointer()) return;
  const scene = document.querySelector<HTMLElement>('[data-escena]');
  if (!scene || scene.dataset.ready) return;
  scene.dataset.ready = '1';
  const layers = Array.from(scene.querySelectorAll<HTMLElement>('[data-parallax]'));
  let raf = 0;
  scene.addEventListener('pointermove', (e) => {
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      for (const l of layers) {
        const f = Number(l.dataset.parallax) || 0.02;
        l.style.setProperty('--px', `${(x * f * 100).toFixed(2)}px`);
        l.style.setProperty('--py', `${(y * f * 100).toFixed(2)}px`);
      }
    });
  });
  scene.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); layers.forEach((l) => { l.style.setProperty('--px', '0px'); l.style.setProperty('--py', '0px'); }); });
}

function initContadores() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-contar]:not([data-contado])'));
  if (!els.length) return;
  const run = (el: HTMLElement) => {
    el.dataset.contado = '1';
    const fin = Number(el.dataset.contar);
    if (!Number.isFinite(fin) || reduce()) { el.textContent = String(fin); return; }
    const t0 = performance.now(); const dur = 900;
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - p, 3); el.textContent = String(Math.round(fin * e)); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); } }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

function initTiras() {
  document.querySelectorAll<HTMLElement>('[data-tira]:not([data-tira-ready])').forEach((tira) => {
    tira.dataset.tiraReady = '1';
    const cont = tira.previousElementSibling as HTMLElement | null;
    if (!cont || !cont.classList.contains('tira-controles')) return;
    const paso = () => { const el = tira.firstElementChild as HTMLElement | null; return el ? el.getBoundingClientRect().width + 16 : 320; };
    cont.querySelector('[data-tira-prev]')?.addEventListener('click', () => tira.scrollBy({ left: -paso(), behavior: reduce() ? 'auto' : 'smooth' }));
    cont.querySelector('[data-tira-next]')?.addEventListener('click', () => tira.scrollBy({ left: paso(), behavior: reduce() ? 'auto' : 'smooth' }));
    tira.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); tira.scrollBy({ left: paso(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tira.scrollBy({ left: -paso(), behavior: 'smooth' }); }
    });
  });
}

let progresoBound = false;
function initProgreso() {
  const bar = document.querySelector<HTMLElement>('.progreso');
  if (!bar) return;
  const pinta = () => { const max = document.documentElement.scrollHeight - window.innerHeight; bar.style.setProperty('--progreso', max > 0 ? `${Math.min(100, (window.scrollY / max) * 100).toFixed(2)}%` : '0%'); };
  pinta();
  if (progresoBound) return;
  progresoBound = true;
  window.addEventListener('scroll', pinta, { passive: true });
  window.addEventListener('resize', pinta);
}

export function initMotion() {
  document.documentElement.classList.add('js');
  initReveal(); initTilt(); initParallax(); initContadores(); initTiras(); initProgreso();
}

/** Recuerda qué obra se abrió desde una galería para devolverle el foco al volver. */
export function rememberOrigin(slug: string) {
  try { sessionStorage.setItem('flv:origin', slug); } catch {}
}
export function restoreOrigin() {
  try {
    const slug = sessionStorage.getItem('flv:origin');
    if (!slug) return;
    sessionStorage.removeItem('flv:origin');
    const el = document.querySelector<HTMLElement>(`[data-work-link="${slug}"]`);
    if (el) el.focus();
  } catch {}
}
