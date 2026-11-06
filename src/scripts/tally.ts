/**
 * Loads the Tally embed script on demand and relays messages from Tally forms.
 * Tally is the external form handler. No form data passes through this website.
 */
type TallyApi = {
  loadEmbeds: () => void;
  openPopup: (formId: string, options?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    Tally?: TallyApi;
  }
}

const SCRIPT_SRC = 'https://tally.so/widgets/embed.js';
let pending: Promise<TallyApi> | null = null;

export function loadTally(): Promise<TallyApi> {
  if (window.Tally) return Promise.resolve(window.Tally);
  pending ??= new Promise<TallyApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.Tally ? resolve(window.Tally) : reject(new Error('Tally did not initialise')));
    script.onerror = () => {
      pending = null;
      reject(new Error('The Tally script could not be loaded'));
    };
    document.head.append(script);
  });
  return pending;
}

export type TallyMessage = { event: string; payload?: { formId?: string } };

export function onTallyMessage(handler: (message: TallyMessage, source: MessageEventSource | null) => void) {
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://tally.so' || typeof event.data !== 'string') return;
    try {
      const message = JSON.parse(event.data) as TallyMessage;
      if (typeof message?.event === 'string' && message.event.startsWith('Tally.')) handler(message, event.source);
    } catch {
      // Ignore messages that are not from a Tally form.
    }
  });
}

type FormState = 'idle' | 'loading' | 'slow' | 'ready' | 'submitted';

function setState(form: HTMLElement, state: FormState) {
  form.dataset.state = state;
  for (const el of form.querySelectorAll<HTMLElement>('[data-show-when]')) {
    el.hidden = !(el.dataset.showWhen ?? '').split(' ').includes(state);
  }
}

/** Inline Tally embeds: loading, slow-network and submitted states, driven by real Tally events. */
export function initTallyEmbeds() {
  const forms = Array.from(document.querySelectorAll<HTMLElement>('[data-tally-embed]:not([data-ready])'));
  if (forms.length === 0) return;

  for (const form of forms) {
    form.dataset.ready = '';
    setState(form, 'idle');
  }

  const findForm = (message: TallyMessage, source: MessageEventSource | null) =>
    forms.find((form) => form.querySelector('iframe')?.contentWindow === source) ??
    forms.find((form) => message.payload?.formId && form.dataset.formId === message.payload.formId);

  onTallyMessage((message, source) => {
    const form = findForm(message, source);
    if (!form) return;
    if (message.event === 'Tally.FormLoaded' && form.dataset.state !== 'submitted') setState(form, 'ready');
    if (message.event === 'Tally.FormSubmitted') {
      setState(form, 'submitted');
      form.querySelector<HTMLElement>('[data-success]')?.focus();
    }
  });

  const start = (form: HTMLElement) => {
    const iframe = form.querySelector<HTMLIFrameElement>('iframe[data-tally-src]');
    if (!iframe) return;
    setState(form, 'loading');
    const fallback = () => {
      if (!iframe.src && iframe.dataset.tallySrc) iframe.src = iframe.dataset.tallySrc;
    };
    loadTally()
      .then((tally) => tally.loadEmbeds())
      .catch(fallback);
    window.setTimeout(() => {
      if (form.dataset.state === 'loading') setState(form, 'slow');
    }, 12000);
  };

  if (!('IntersectionObserver' in window)) {
    forms.forEach(start);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          start(entry.target as HTMLElement);
        }
      }
    },
    { rootMargin: '600px 0px' },
  );
  forms.forEach((form) => observer.observe(form));
}

/** Links that open a Tally form as a popup, for example the newsletter sign-up. */
export function initTallyPopups() {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-tally-popup]:not([data-ready])')) {
    link.dataset.ready = '';
    const formId = link.dataset.tallyPopup;
    if (!formId) continue;
    const status = link.dataset.statusTarget ? document.getElementById(link.dataset.statusTarget) : null;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      loadTally()
        .then((tally) =>
          tally.openPopup(formId, {
            layout: 'modal',
            width: 520,
            hiddenFields: { language: document.documentElement.lang, page: window.location.pathname },
            onSubmit: () => {
              if (status) status.textContent = link.dataset.thanks ?? '';
            },
          }),
        )
        .catch(() => window.open(link.href, '_blank', 'noopener'));
    });
  }
}
