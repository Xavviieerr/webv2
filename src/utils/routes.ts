/**
 * Language-aware route mapping
 * Maps routes based on the current language
 */

export type Language = "en" | "urhobo";

// Route mappings: English -> Urhobo
const routeMap: Record<string, { en: string; urhobo: string }> = {
  home: { en: "/home", urhobo: "/uwevwi" },
  about: { en: "/about", urhobo: "/kpahe" },
  encyclopedia: { en: "/encyclopedia", urhobo: "/encyclopedia" }, // Keep same for now
  donate: { en: "/donate", urhobo: "/siobonu" },
};

// Reverse mapping: URL -> route key
const reverseRouteMap: Record<string, string> = {
  "/home": "home",
  "/uwevwi": "home",
  "/about": "about",
  "/kpahe": "about",
  "/encyclopedia": "encyclopedia",
  "/donate": "donate",
  "/siobonu": "donate",
};

/**
 * Get the route for a given route key based on language
 */
export const getRoute = (routeKey: string, language: Language): string => {
  const route = routeMap[routeKey];
  if (!route) {
    // If route not found, return the key as-is (for routes like /terms, /privacy, etc.)
    return routeKey.startsWith("/") ? routeKey : `/${routeKey}`;
  }
  return route[language];
};

/**
 * Get the route key from a URL path
 */
export const getRouteKey = (path: string): string | null => {
  return reverseRouteMap[path] || null;
};

/**
 * Get the language-specific route for the current path
 */
export const getLocalizedRoute = (path: string, language: Language): string => {
  const routeKey = getRouteKey(path);
  if (routeKey) {
    return getRoute(routeKey, language);
  }
  // If path is not in the map, return as-is
  return path;
};

