import { prefersReducedMotion } from './motion';

/**
 * Counts statistics up from zero once, when they first scroll into view.
 * Figures already visible on load keep their final value, so nothing flashes.
 * Reduced-motion users always see the final value.
 */
const DURATION = 900;

function format(el: HTMLElement, value: number): string {
  const formatter = new Intl.NumberFormat(el.dataset.locale || 'en-IN');
  return `${el.dataset.prefix ?? ''}${formatter.format(value)}${el.dataset.suffix ?? ''}`;
}

function animate(el: HTMLElement) {
  const target = Number(el.dataset.counter);
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / DURATION);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = format(el, Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initCounters() {
  const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-counter]:not([data-counter-state])'));
  if (counters.length === 0 || prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (el.dataset.counterState === 'pending') {
          if (entry.isIntersecting) {
            el.dataset.counterState = 'done';
            observer.unobserve(el);
          } else {
            el.style.minWidth = `${Math.ceil(el.getBoundingClientRect().width)}px`;
            el.textContent = format(el, 0);
            el.dataset.counterState = 'armed';
          }
        } else if (el.dataset.counterState === 'armed' && entry.isIntersecting) {
          el.dataset.counterState = 'done';
          observer.unobserve(el);
          animate(el);
        }
      }
    },
    { threshold: 0.5 },
  );

  for (const el of counters) {
    el.dataset.counterState = 'pending';
    observer.observe(el);
  }
}
