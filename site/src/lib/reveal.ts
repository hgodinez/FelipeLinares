/** Reveal-on-scroll. Adds .is-visible once; respects reduced motion by revealing immediately. */
export function initReveal() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)'));
  if (!els.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px 12% 0px', threshold: 0 },
  );
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 1.12 && r.bottom > 0) el.classList.add('is-visible');
    else io.observe(el);
  });
}
