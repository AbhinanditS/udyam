/**
 * Header behaviour: compact state after scrolling, the work-areas menu (disclosure pattern)
 * and the mobile navigation drawer (native modal dialog).
 */
export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  const sentinel = document.querySelector('[data-header-sentinel]');
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      header.toggleAttribute('data-scrolled', entry ? !entry.isIntersecting : false);
    }).observe(sentinel);
  }

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = toggle ? document.getElementById(toggle.getAttribute('aria-controls') ?? '') : null;
  if (toggle && panel) {
    const open = () => {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    };
    const close = (returnFocus = false) => {
      if (panel.hidden) return;
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => (panel.hidden ? open() : close()));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close(true);
    });
    document.addEventListener('click', (event) => {
      const target = event.target as Node;
      if (!panel.contains(target) && !toggle.contains(target)) close();
    });
    panel.addEventListener('focusout', (event) => {
      const next = event.relatedTarget as Node | null;
      if (next && !panel.contains(next) && next !== toggle) close();
    });
  }

  const drawer = document.querySelector<HTMLDialogElement>('[data-drawer]');
  const openButton = document.querySelector<HTMLButtonElement>('[data-drawer-open]');
  if (drawer && openButton) {
    openButton.addEventListener('click', () => {
      drawer.showModal();
      openButton.setAttribute('aria-expanded', 'true');
    });
    drawer.querySelector('[data-drawer-close]')?.addEventListener('click', () => drawer.close());
    drawer.addEventListener('close', () => {
      openButton.setAttribute('aria-expanded', 'false');
      openButton.focus();
    });
    drawer.addEventListener('click', (event) => {
      if (event.target === drawer) drawer.close();
    });
    for (const link of drawer.querySelectorAll('a')) {
      link.addEventListener('click', () => drawer.close());
    }
    window.matchMedia('(min-width: 80rem)').addEventListener('change', (event) => {
      if (event.matches && drawer.open) drawer.close();
    });
  }
}
