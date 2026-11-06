import { scrollBehavior } from './motion';

/**
 * Scroll-snap carousels with previous and next buttons. There is no autoplay.
 * Controls hide when every slide already fits.
 */
export function initCarousels() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-carousel]:not([data-ready])')) {
    root.dataset.ready = '';
    const rail = root.querySelector<HTMLElement>('[data-rail]');
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    const status = root.querySelector<HTMLElement>('[data-status]');
    if (!rail || !prev || !next) continue;

    const slides = () => Array.from(rail.children) as HTMLElement[];
    const stepSize = () => {
      const [first, second] = slides();
      if (!first) return rail.clientWidth;
      return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    };
    const currentIndex = () => Math.round(rail.scrollLeft / Math.max(1, stepSize()));

    const update = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const overflows = maxScroll > 2;
      root.toggleAttribute('data-static', !overflows);
      prev.setAttribute('aria-disabled', String(rail.scrollLeft <= 2));
      next.setAttribute('aria-disabled', String(rail.scrollLeft >= maxScroll - 2));
    };

    const announce = () => {
      if (!status) return;
      const total = slides().length;
      const current = Math.min(total, currentIndex() + 1);
      status.textContent = (status.dataset.template ?? '{current} / {total}')
        .replace('{current}', String(current))
        .replace('{total}', String(total));
    };

    const move = (direction: 1 | -1) => {
      rail.scrollBy({ left: direction * stepSize(), behavior: scrollBehavior() });
    };

    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));

    let frame = 0;
    let settle = 0;
    rail.addEventListener(
      'scroll',
      () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(update);
        window.clearTimeout(settle);
        settle = window.setTimeout(announce, 160);
      },
      { passive: true },
    );

    rail.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      }
    });

    new ResizeObserver(update).observe(rail);
    update();
  }
}
