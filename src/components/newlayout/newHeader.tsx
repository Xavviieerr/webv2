"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useAppSelector } from "@/types/hooks";
import { logoutHandler } from "@/features/auth";
import { useInitTranslation } from "@/hooks";
import { UtilityBar } from "./utilityBar";
import { useTranslation } from "react-i18next";

export default function NewHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation("common");
  useInitTranslation();

  const handleSignOut = () => {
    logoutHandler();
    router.push("/home");
    setMobileOpen(false);
  };

  const navItems = [
    { label: t("home"), href: "/home" },
    { label: t("howItWorks"), href: "/#how-it-works" },
    { label: t("about"), href: "/about" },
    { label: t("donate"), href: "/donate" },
    // { label: "Careers", href: "/careers" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="w-full bg-[#F2FEFF]">
      <UtilityBar />
      {/* Main header area - light background */}
      <div className=" max-w-[1700px] mx-auto">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 ">
          {/* Logo - left */}
          <Link href="/" className="shrink-0">
            <Image
              src="/guono-logo.svg"
              alt="Guọnọ Logo"
              width={100}
              height={30}
              className="h-7 w-auto sm:h-8 lg:h-[30px] lg:w-[100px]"
            />
          </Link>

          {/* Desktop: center nav + right actions */}
          <div className="hidden lg:flex gap-4 ">
            <NavigationMenu
              viewport={false}
              className="flex-1 justify-center max-w-max"
            >
              <NavigationMenuList className="flex h-auto list-none items-center justify-center gap-0.5 rounded-none border-0 bg-transparent p-0">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <NavigationMenuItem key={item.href} className="relative">
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "inline-flex h-9 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary-2/15 text-primary"
                              : "text-black hover:bg-primary-2/10 hover:text-primary",
                          )}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-4 shrink-0">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-black hover:text-primary transition-colors"
                  >
                    {t("dashboard")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2 focus-visible:ring-offset-2"
                  >
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-black hover:text-primary transition-colors"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2 focus-visible:ring-offset-2"
                  >
                    {t("tryForFree")}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-primary-2/10 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel - close button inside so it stays visible */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 bg-white transition-opacity duration-200",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Top bar with close (X) - visible inside overlay */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary-2/10">
          <span className="text-sm font-medium text-foreground">Menu</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-primary-2/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col pt-6 px-6 pb-8 gap-6 max-h-full overflow-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-lg font-medium py-2 border-b border-primary-2/10",
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-3 pt-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 rounded-lg border-2 border-primary-2 text-primary font-medium"
                >
                  {t("dashboard")}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-center py-3 rounded-lg bg-primary text-primary-foreground font-medium"
                >
                  {t("signOut")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 rounded-lg border-2 border-primary-2 text-primary font-medium"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 rounded-lg bg-primary text-primary-foreground font-medium"
                >
                  {t("tryForFree")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
