/**
 * Announcement strip. Shows one announcement at a time with manual controls.
 * There is no automatic rotation, so nothing moves unless the visitor asks.
 */
export function initTickers() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-ticker]:not([data-ready])')) {
    root.dataset.ready = '';
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-ticker-item]'));
    const controls = root.querySelector<HTMLElement>('[data-ticker-controls]');
    const status = root.querySelector<HTMLElement>('[data-ticker-status]');
    if (items.length < 2 || !controls) continue;

    let index = 0;
    const show = (next: number) => {
      index = (next + items.length) % items.length;
      items.forEach((item, i) => {
        item.hidden = i !== index;
      });
      if (status) {
        status.textContent = (status.dataset.template ?? '{current} / {total}')
          .replace('{current}', String(index + 1))
          .replace('{total}', String(items.length));
      }
    };

    controls.hidden = false;
    root.querySelector('[data-ticker-prev]')?.addEventListener('click', () => show(index - 1));
    root.querySelector('[data-ticker-next]')?.addEventListener('click', () => show(index + 1));
    show(0);
  }
}
