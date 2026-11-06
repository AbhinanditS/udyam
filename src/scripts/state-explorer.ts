/** State and union territory selector on the Impact page. The full list works without JavaScript. */
export function initStateExplorer() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-state-explorer]:not([data-ready])')) {
    root.dataset.ready = '';
    const select = root.querySelector<HTMLSelectElement>('select');
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-state-panel]'));
    const intro = root.querySelector<HTMLElement>('[data-state-intro]');
    if (!select) continue;

    for (const el of root.querySelectorAll<HTMLElement>('[data-js-only]')) el.hidden = false;

    const show = (code: string) => {
      for (const panel of panels) panel.hidden = panel.dataset.statePanel !== code;
      if (intro) intro.hidden = code !== '';
    };
    select.addEventListener('change', () => show(select.value));

    const match = window.location.hash.match(/^#state-([A-Z]{2})$/);
    if (match?.[1] && panels.some((panel) => panel.dataset.statePanel === match[1])) {
      select.value = match[1];
      show(match[1]);
    }
  }
}
