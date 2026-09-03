export const PROTECTED_ROUTES = [
  "/search",
  "/dashboard",
  "/settings",
  "/sports",
  "/history",
];

export const HOME_ROUTES = ["/home", "/uwevwi"];

export const AUTH_ROUTES = [
  "/signin",
  "/signup",
  "/verify-otp",
  "/forgot-password",
];

/**
 * Redirect targets for auth guard:
 * - unauthenticated: where to send users who hit protected routes without a session
 * - authenticated: where to send logged-in users who hit auth/home routes
 */
export const REDIRECTS = {
  unauthenticated: "/home",
  authenticated: "/search",
} as const;

/**
 * Language-aware route map (English ↔ Urhobo).
 * Used by middleware for language routing.
 */
export const ROUTE_MAP: Record<string, { en: string; urhobo: string }> = {
  "/home": { en: "/home", urhobo: "/uwevwi" },
  "/uwevwi": { en: "/home", urhobo: "/uwevwi" },
  "/about": { en: "/about", urhobo: "/kpahe" },
  "/kpahe": { en: "/about", urhobo: "/kpahe" },
  "/donate": { en: "/donate", urhobo: "/siobonu" },
  "/siobonu": { en: "/donate", urhobo: "/siobonu" },
  "/encyclopedia": { en: "/encyclopedia", urhobo: "/oberiare" },
};

/**
 * Generates the Next.js middleware matcher from route arrays.
 * Includes: root, protected paths with /*, auth paths, and language-aware paths.
 */
export function buildMatcher(
  protectedRoutes: string[],
  authRoutes: string[],
  languageRoutes: Record<string, { en: string; urhobo: string }>,
): string[] {
  const matcher: string[] = ["/"];

  for (const route of protectedRoutes) {
    matcher.push(`${route}/:path*`);
  }

  for (const route of authRoutes) {
    matcher.push(route);
  }

  const added = new Set<string>();
  for (const paths of Object.values(languageRoutes)) {
    for (const p of Object.values(paths)) {
      if (!added.has(p)) {
        matcher.push(p);
        added.add(p);
      }
    }
  }

  return matcher;
}
