/**
 * Accessible media viewer for the gallery, built on a modal dialog.
 * Arrow keys move between items, Escape closes, focus returns to the opened item.
 */
export function initLightboxes() {
  for (const gallery of document.querySelectorAll<HTMLElement>('[data-gallery]:not([data-ready])')) {
    gallery.dataset.ready = '';
    const dialog = document.getElementById(gallery.dataset.gallery ?? '') as HTMLDialogElement | null;
    if (!dialog) continue;
    const stage = dialog.querySelector<HTMLElement>('[data-stage]');
    const caption = dialog.querySelector<HTMLElement>('[data-caption]');
    const status = dialog.querySelector<HTMLElement>('[data-status]');
    const prev = dialog.querySelector<HTMLButtonElement>('[data-prev]');
    const next = dialog.querySelector<HTMLButtonElement>('[data-next]');
    if (!stage || !caption) continue;

    let current = 0;
    let opener: HTMLElement | null = null;
    const visibleItems = () =>
      Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-media]')).filter((item) => !item.closest('[hidden]'));

    const render = () => {
      const items = visibleItems();
      const item = items[current];
      if (!item) return;
      const data = item.dataset;
      stage.replaceChildren();
      if (data.type === 'video' && data.youtube) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${data.youtube}?autoplay=1&rel=0`;
        iframe.title = data.title ?? '';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        iframe.className = 'aspect-video w-full max-w-5xl rounded-md bg-black';
        stage.append(iframe);
      } else if (data.type === 'video' && data.video) {
        const video = document.createElement('video');
        video.src = data.video;
        video.controls = true;
        video.autoplay = true;
        video.className = 'max-h-[78dvh] w-full max-w-5xl rounded-md bg-black';
        stage.append(video);
      } else if (data.src) {
        const img = document.createElement('img');
        img.src = data.src;
        if (data.srcset) img.srcset = data.srcset;
        img.sizes = '100vw';
        img.alt = data.alt ?? '';
        img.className = 'max-h-[78dvh] w-auto max-w-full rounded-md object-contain';
        stage.append(img);
      }
      caption.textContent = data.caption || data.title || '';
      if (status) status.textContent = `${current + 1} / ${items.length}`;
      const single = items.length < 2;
      if (prev) prev.hidden = single;
      if (next) next.hidden = single;
    };

    const go = (step: number) => {
      const total = visibleItems().length;
      current = (current + step + total) % total;
      render();
    };

    gallery.addEventListener('click', (event) => {
      const item = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-media]');
      if (!item) return;
      opener = item;
      current = Math.max(0, visibleItems().indexOf(item));
      render();
      dialog.showModal();
    });
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    });
    dialog.addEventListener('close', () => {
      stage.replaceChildren();
      opener?.focus();
    });
  }
}
