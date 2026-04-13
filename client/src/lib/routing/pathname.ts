/**
 * Path matching for navigation active states (header, drawer, tabs).
 */

/** Collapses trailing slash except root. */
export function normalizePathname(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

/** True when `pathname` is `href` or a nested path under `href`. */
export function isPathActive(pathname: string, href: string): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(href);
  if (p === h) return true;
  return p.startsWith(`${h}/`);
}
