/**
 * Determines if a nav item should be considered active based on the current pathname.
 *
 * @param pathname - Current URL pathname from usePathname()
 * @param itemUrl - The nav item's URL
 * @param exact - If true, match only exact pathname (used for /dashboard root)
 * @returns Whether the item is active
 */
export function isRouteActive(
  pathname: string | null,
  itemUrl: string | undefined,
  exact = false,
): boolean {
  if (!pathname || !itemUrl) return false;

  if (exact) {
    return pathname === itemUrl || pathname === itemUrl + "/";
  }

  return pathname === itemUrl || pathname.startsWith(itemUrl + "/");
}
