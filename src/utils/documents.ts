import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

export type DocumentInfo = {
  href: string;
  bytes: number;
  extension: string;
};

/**
 * Looks up a file inside public/. Returns null when the path is empty or the file is missing,
 * so download buttons appear only for documents that really exist.
 */
export function getDocument(publicPath: string | undefined): DocumentInfo | null {
  if (!publicPath || !publicPath.startsWith('/')) return null;
  const filePath = join(process.cwd(), 'public', decodeURI(publicPath));
  if (!existsSync(filePath)) return null;
  const stats = statSync(filePath);
  if (!stats.isFile()) return null;
  const extension = (publicPath.split('.').pop() ?? '').toUpperCase();
  return { href: publicPath, bytes: stats.size, extension };
}

/** Human-readable file size, for example "2.4 MB" or "640 KB". */
export function formatFileSize(bytes: number, labels: { mb: string; kb: string }): string {
  if (bytes >= 1024 * 1024) {
    return labels.mb.replace('{size}', (bytes / (1024 * 1024)).toFixed(1));
  }
  return labels.kb.replace('{size}', String(Math.max(1, Math.round(bytes / 1024))));
}
