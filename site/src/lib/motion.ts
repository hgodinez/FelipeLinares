/**
 * Motion gestures (progressive enhancement).
 * - `.unfold` / `.reveal-mask` get `.is-in` once they enter the viewport (DESPLEGAR / REVELAR).
 * - Elements already in view on load are shown immediately so nothing ever waits for scroll.
 * - Reduced motion: CSS renders final states; the class is still added for consistency.
 *
 * Visibility is measured with getBoundingClientRect on a rAF-throttled scroll listener rather
 * than IntersectionObserver: Chromium treats an element hidden by clip-path as non-intersecting,
 * which would make a clipped sheet wait forever for its own reveal.
 */
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let pending: HTMLElement[] = [];
let scheduled = false;
let bound = false;

function check() {
  scheduled = false;
  const vh = window.innerHeight;
  pending = pending.filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > 0) { el.classList.add('is-in'); return false; }
    return true;
  });
  if (!pending.length) unbind();
}
function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(check); } }
function bind() { if (bound) return; bound = true; window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule); }
function unbind() { if (!bound) return; bound = false; window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); }

export function initMotion() {
  document.documentElement.classList.add('js');
  const els = Array.from(document.querySelectorAll<HTMLElement>('.unfold:not(.is-in), .reveal-mask:not(.is-in), .zoom-in:not(.is-in), .rise:not(.is-in), .wipe:not(.is-in)'));
  if (!els.length) return;
  if (reduce()) { els.forEach((el) => el.classList.add('is-in')); return; }
  pending = els;
  bind();
  check();
}

/** Remember which artwork was opened from a gallery so the detail page can return focus to it. */
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
