/**
 * Helper to resolve image URLs correctly whether hosted at domain root
 * or in a GitHub Pages subfolder (e.g. /Emplatados-/).
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  // Strip leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const base = metaEnv?.BASE_URL || './';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}
