import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PROTECTED_ROUTES,
  AUTH_ROUTES,
  ROUTE_MAP,
  REDIRECTS,
} from "@/features/auth/constants";

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(request: NextRequest) {
  const rawPathname = request.nextUrl.pathname;
  let pathname: string;

  try {
    pathname = decodeURIComponent(rawPathname);
  } catch {
    pathname = rawPathname;
  }

  const isLoggedIn =
    request.cookies.get("guono_logged_in")?.value === "1";

  // Root redirect
  if (pathname === "/" || rawPathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = isLoggedIn ? REDIRECTS.authenticated : REDIRECTS.unauthenticated;
    return NextResponse.redirect(url);
  }

  // Protected routes: redirect to home if not logged in
  if (isProtectedPath(pathname) && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECTS.unauthenticated;
    return NextResponse.redirect(url);
  }

  // Auth routes: redirect to search if already logged in
  if (isAuthPath(pathname) && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECTS.authenticated;
    return NextResponse.redirect(url);
  }

  // Logged-in users cannot access /home or /uwevwi; redirect to /search
  if (
    isLoggedIn &&
    (pathname === "/home" ||
      pathname === "/uwevwi" ||
      rawPathname === "/home" ||
      rawPathname === "/uwevwi")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECTS.authenticated;
    return NextResponse.redirect(url);
  }

  // Get language from cookie (stored by languageStore)
  const langCookie = request.cookies.get("lang");
  const language = (langCookie?.value as "en" | "urhobo") || "urhobo";

  // Check if this is a language-aware route (try both raw and decoded)
  const currentRoute = ROUTE_MAP[pathname] || ROUTE_MAP[rawPathname];

  if (currentRoute) {
    const correctRoute = currentRoute[language];

    if (correctRoute && correctRoute !== pathname && correctRoute !== rawPathname) {
      const url = request.nextUrl.clone();
      url.pathname = correctRoute;
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/uwevwi",
    "/about",
    "/kpahe",
    "/donate",
    "/siobonu",
    "/encyclopedia",
    "/oberiare",
    "/dashboard/:path*",
    "/search/:path*",
    "/settings/:path*",
    "/sports/:path*",
    "/history/:path*",
    "/signin",
    "/signup",
    "/verify-otp",
    "/forgot-password",
  ],
};
