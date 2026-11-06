/**
 * Category filter chips. Each chip has data-filter="category" (or "all");
 * each item has data-category. The status element announces the result count.
 */
export function initFilters() {
  for (const group of document.querySelectorAll<HTMLElement>('[data-filter-group]:not([data-ready])')) {
    group.dataset.ready = '';
    const target = document.getElementById(group.dataset.filterGroup ?? '');
    if (!target) continue;
    const chips = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const items = Array.from(target.querySelectorAll<HTMLElement>('[data-category]'));
    const empty = target.parentElement?.querySelector<HTMLElement>('[data-filter-empty]');

    group.hidden = false;
    for (const chip of chips) {
      chip.addEventListener('click', () => {
        const value = chip.dataset.filter ?? 'all';
        chips.forEach((other) => other.setAttribute('aria-pressed', String(other === chip)));
        let shown = 0;
        for (const item of items) {
          const match = value === 'all' || item.dataset.category === value;
          item.hidden = !match;
          if (match) shown += 1;
        }
        if (empty) empty.hidden = shown > 0;
      });
    }
  }
}

/** Buttons elsewhere on the page that apply a filter and scroll to the filtered list. */
export function initFilterLinks() {
  for (const link of document.querySelectorAll<HTMLElement>('[data-filter-link]:not([data-ready])')) {
    link.dataset.ready = '';
    link.addEventListener('click', (event) => {
      const [groupId, value] = (link.dataset.filterLink ?? '').split(':');
      const group = document.querySelector<HTMLElement>(`[data-filter-group="${groupId}"]`);
      const chip = group?.querySelector<HTMLButtonElement>(`[data-filter="${value}"]`);
      if (!group || !chip) return;
      event.preventDefault();
      chip.click();
      const target = document.getElementById(link.getAttribute('href')?.slice(1) ?? '');
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      chip.focus({ preventScroll: true });
    });
  }
}
