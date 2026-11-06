/** Click-to-load YouTube embeds. Nothing loads from YouTube until the visitor presses play. */
export function initVideos() {
  for (const box of document.querySelectorAll<HTMLElement>('[data-youtube]:not([data-ready])')) {
    box.dataset.ready = '';
    const button = box.querySelector('button');
    button?.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${box.dataset.youtube}?autoplay=1&rel=0`;
      iframe.title = box.dataset.title ?? '';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.className = 'absolute inset-0 h-full w-full';
      box.replaceChildren(iframe);
      iframe.focus();
    });
  }
}
