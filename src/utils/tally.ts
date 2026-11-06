export type TallyForm = {
  /** Tally form ID, when the link is a tally.so link. */
  id: string | null;
  /** Link that opens the form on its own page. */
  shareUrl: string;
  /** Embeddable address, when the form can be embedded. */
  embedUrl: string | null;
};

/**
 * Accepts a Tally share link (https://tally.so/r/abc123), an embed link (https://tally.so/embed/abc123)
 * or any other https form link. Other links are shown as a button that opens the form.
 */
export function parseTallyUrl(value: string): TallyForm | null {
  const input = value.trim();
  if (!input) return null;
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (url.hostname === 'tally.so') {
    const match = url.pathname.match(/^\/(?:r|embed|forms)\/([A-Za-z0-9]+)/);
    if (match?.[1]) {
      const id = match[1];
      return { id, shareUrl: `https://tally.so/r/${id}`, embedUrl: `https://tally.so/embed/${id}` };
    }
  }
  return { id: null, shareUrl: url.toString(), embedUrl: null };
}
