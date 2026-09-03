"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
} from "next/navigation";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import ProfileModal from "../ProfileModal";
import UsernameModal from "../UsernameModal";
import PasswordModal from "../PasswordModal";
import DeleteAccountModal from "../DeleteModal";
import { logoutHandler } from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { profileLinks } from "@/types";
import { setLanguage } from "@/slice/changeLangSlice";
import { RootState } from "@/store/store";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MainProfilePage } from "@/features/dashboard/profile";
import { LanguageSwitcher } from "@/features/shared";

interface NavbarProps {
  searchQuery?: string;
  activeModal?: string | null;
  onOpenModal?: (modalName: string) => void;
  onCloseModal?: () => void;
  renderModalsExternally?: boolean;
}

function Navbar({
  searchQuery = "",
  activeModal: externalActiveModal,
  onOpenModal: externalOpenModal,
  onCloseModal: externalCloseModal,
  renderModalsExternally = false,
}: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] =
    useState(false);
  const [isMobileProfileCollapsed, setIsMobileProfileCollapsed] =
    useState(true);
  const [internalActiveModal, setInternalActiveModal] = useState<string | null>(
    null,
  );
  const [isNewMobileMenuOpen, setIsNewMobileMenuOpen] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();

  const q = params?.slug ?? searchParams.get("q");

  // Use external modal state if provided, otherwise use internal
  const activeModal =
    externalActiveModal !== undefined
      ? externalActiveModal
      : internalActiveModal;

  const { user } = useAppSelector((state) => state.auth);

  const initials = useMemo(() => {
    const displayName =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      user?.email ||
      "User";
    return displayName
      .split(" ")
      .map((part: string) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  const language = useAppSelector(
    (state: RootState) => state.language.language,
  );
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  const profileRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);

  // Define navigation links with language-aware routes
  const navLinks = [
    { label: "home", href: language === "en" ? "/home" : "/uwevwi" },
    { label: "about", href: language === "en" ? "/about" : "/kpahe" },
    { label: "Guọnọpedia", href: "/dashboard" },
    { label: "donate", href: language === "en" ? "/donate" : "/siobonu" },
  ];

  // Sync i18n with Redux language state
  useEffect(() => {
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;

      // Don't interfere with mobile menu interactions - only handle language dropdown
      const mobileMenu = document.querySelector("[data-mobile-menu]");
      if (mobileMenu && mobileMenu.contains(target)) {
        // Only handle language dropdown closing inside mobile menu
        if (
          mobileLanguageDropdownRef.current &&
          !mobileLanguageDropdownRef.current.contains(target)
        ) {
          setIsMobileLanguageDropdownOpen(false);
        }
        return; // Don't process other dropdowns when inside mobile menu
      }

      // Check if clicking on mobile menu trigger button - don't process if so
      if (target instanceof Element) {
        const mobileMenuButton = target.closest(
          'button[aria-label="Toggle Profile Menu"]',
        );
        if (mobileMenuButton) {
          return; // Let the button's onClick handle the toggle
        }
      }

      // Check profile dropdown - ensure we're not clicking inside the ref
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      // Check language dropdown - ensure we're not clicking inside the ref
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        mobileLanguageDropdownRef.current &&
        !mobileLanguageDropdownRef.current.contains(target)
      ) {
        setIsMobileLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLanguageSelect = (
    lang: "en" | "urhobo",
    e?: React.MouseEvent | React.TouchEvent,
  ) => {
    // Prevent event propagation to avoid closing dropdown prematurely
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Update Redux state (which also updates localStorage and cookie via the reducer)
    dispatch(setLanguage(lang));
    // Update i18n immediately
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }

    // Close dropdowns
    setIsLanguageDropdownOpen(false);
    setIsMobileLanguageDropdownOpen(false);

    // Small delay to ensure state updates before navigation
    setTimeout(() => {
      // Redirect to language-specific route if on a language-aware page
      const routeMap: Record<string, { en: string; urhobo: string }> = {
        "/home": { en: "/home", urhobo: "/uwevwi" },
        "/uwevwi": { en: "/home", urhobo: "/uwevwi" },
        "/about": { en: "/about", urhobo: "/kpahe" },
        "/kpahe": { en: "/about", urhobo: "/kpahe" },
        "/donate": { en: "/donate", urhobo: "/siobonu" },
        "/siobonu": { en: "/donate", urhobo: "/siobonu" },
      };

      const currentRoute = routeMap[pathname];
      if (currentRoute && currentRoute[lang] !== pathname) {
        router.push(currentRoute[lang]);
      }
    }, 100);
  };

  const handleLogOut = () => {
    logoutHandler();
    router.push("/home");
  };

  const openModal = (modalName: string) => {
    if (externalOpenModal) {
      externalOpenModal(modalName);
    } else {
      setInternalActiveModal(modalName);
    }
    setIsProfileOpen(false);
  };

  const closeModal = () => {
    if (externalCloseModal) {
      externalCloseModal();
    } else {
      setInternalActiveModal(null);
    }
  };

  return (
    <nav
      className="flex w-full sticky top-0 min-h-[56px] sm:min-h-[64px]"
      style={{ zIndex: 50 }}
    >
      <div className="flex flex-col w-full px-3 sm:px-6 z-50 lg:px-8 py-2 sm:py-3 bg-backg border-b border-secondary-foreground-50 relative min-h-[56px] sm:min-h-[64px]">
        {/* Main row: left + center + right */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full min-h-[48px]">
          {/* Left - Dashboard (and mobile menu trigger when no user) */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            {user && !searchQuery && !q ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-center px-3 py-2.5 sm:px-4 rounded-lg text-white text-xs sm:text-sm md:text-base 
              font-semibold hover:opacity-90 transition-all whitespace-nowrap bg-[#165e5b]"
                style={{ backgroundColor: "#165e5b" }}
              >
                <span className="hidden sm:inline">{t("dashboard")}</span>
                <span className="sm:hidden">{t("dashboard")}</span>
              </Link>
            ) : (
              <Link href={`/`} className="flex cursor-pointer">
                <Image
                  src="/guono-logo.svg"
                  alt="Guọnọ logo"
                  width={100}
                  height={30}
                  className="h-7 md:h-8 w-auto"
                />
              </Link>
            )}
          </div>

          {/* Right - User / Login */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/*  Profile / Login */}
            {user ? (
              <>
                {/* Desktop Profile - Select-like Dropdown */}
                <div
                  className="hidden md:block relative cursor-pointer transition-all "
                  ref={profileRef}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className="flex items-center gap-2 cursor-pointer h-fit w-fit"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                  >
                    {/* <Image
                  src={user?.profilePictureUrl || "/man.png"}
                  alt="User profile"
                  className="rounded-full border-2 border-gray-300 shrink-0 max-h-[40px] max-w-[40px]"
                  width={40}
                  height={40}
                />
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform shrink-0 ${isProfileOpen ? "rotate-180" : ""}`}
                /> */}
                    <Avatar
                      size="lg"
                      className="border-2 border-gray-300 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNewMobileMenuOpen(!isNewMobileMenuOpen);
                      }}
                    >
                      <AvatarImage
                        src={user?.profilePictureUrl}
                        alt={user?.username || "User"}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col">
                        {/* Username Header */}
                        <div className="px-4 py-2.5">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.username || "Username"}
                          </p>
                        </div>

                        {/* Menu Items */}
                        {profileLinks.map((link, index) => {
                          const isPassword = link.modal === "password";
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                openModal(link.modal);
                                setIsProfileOpen(false);
                              }}
                              className={`px-4 py-2.5 text-sm flex justify-between items-center transition-all ${
                                isPassword
                                  ? "bg-[#165e5b] text-white"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <span>{t(link.t)}</span>
                              <MdOutlineArrowForwardIos
                                className={
                                  isPassword ? "text-white/80" : "text-gray-400"
                                }
                                size={14}
                              />
                            </button>
                          );
                        })}

                        {/* Separator */}
                        <div className="border-t border-gray-200 my-1"></div>

                        {/* Language Section */}
                        <div
                          className="px-4 py-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-xs text-gray-500 mb-2">
                            {t("preferredLanguage") || "Language"}
                          </p>
                          <div className="relative" ref={languageDropdownRef}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsLanguageDropdownOpen(
                                  !isLanguageDropdownOpen,
                                );
                              }}
                              className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 transition-all focus:outline-none"
                            >
                              <span>{language === "en" ? "ENG" : "URH"}</span>
                              <ChevronDown
                                className={`w-3 h-3 text-gray-500 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
                              />
                            </button>

                            {isLanguageDropdownOpen && (
                              <div
                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-60"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLanguageSelect("urhobo", e);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                                    language === "urhobo"
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <Image
                                    src="/images/urhobo.png"
                                    alt="Urhobo"
                                    width={14}
                                    height={14}
                                    className="object-contain"
                                  />
                                  URH
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLanguageSelect("en", e);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                                    language === "en"
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <Image
                                    src="/uk-flag.png"
                                    alt="UK flag"
                                    width={14}
                                    height={14}
                                    className="object-contain rounded-sm"
                                  />
                                  ENG
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Log out */}
                        <button
                          onClick={() => {
                            handleLogOut();
                            setIsProfileOpen(false);
                          }}
                          className="px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors text-center"
                        >
                          {t("logout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* MainProfilePage outside desktop block so mobile can use it too */}
                <MainProfilePage
                  variant="modal"
                  content="profile"
                  open={isNewMobileMenuOpen}
                  onOpenChange={setIsNewMobileMenuOpen}
                />

                {/* Mobile Profile Button */}
                {/* <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="md:hidden flex items-center justify-center rounded-full hover:opacity-90 transition-all"
              aria-label="Toggle Profile Menu"
            >
              <Image
                src={user?.profilePictureUrl || "/man.png"}
                alt="User"
                className="rounded-full border-2 border-gray-300 max-h-[40px] max-w-[40px]"
                width={40}
                height={40}
              />
            </button> */}
                <Avatar
                  size="lg"
                  className="md:hidden border-2 border-gray-300 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNewMobileMenuOpen(!isNewMobileMenuOpen);
                  }}
                >
                  <AvatarImage
                    src={user?.profilePictureUrl}
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Link
                href="/signin"
                className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-2.5 rounded-lg text-white text-xs sm:text-sm md:text-base font-semibold hover:opacity-90 transition-all whitespace-nowrap"
                style={{ backgroundColor: "#165e5b" }}
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        {isMobileMenuOpen && user && (
          <div
            className="md:hidden fixed inset-0 bg-[#f2feff] z-50 flex flex-col px-3 py-4 space-y-6"
            data-mobile-menu
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar with logo and close button */}
            <div className="flex justify-between items-center mt-4 mb-8">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/guono-logo.svg"
                  alt="guọnọ"
                  width="100"
                  height="30"
                  aria-label="Guọnọ logo"
                />
              </Link>
              <button
                className="md:hidden focus:outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <svg
                  className="w-6 h-6 text-[#05353A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Section */}
            <div className="space-y-4 mt-4">
              {/* Collapsible User Profile Header */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileProfileCollapsed(!isMobileProfileCollapsed);
                }}
                className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
              >
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-[#05353A] text-lg">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-[#05353A] transition-transform ${isMobileProfileCollapsed ? "" : "rotate-180"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>

              {/* Collapsible Profile Content */}
              {!isMobileProfileCollapsed && (
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                  {profileLinks.map((link, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        openModal(link.modal);
                        setIsMobileMenuOpen(false);
                      }}
                      className="group px-4 py-2 text-sm text-gray-700 hover:bg-[#05353A] active:bg-[#05353A] flex justify-between items-center transition-all duration-200 rounded-lg w-full"
                    >
                      <span className="group-hover:text-white">
                        {t(link.t)}
                      </span>
                      <MdOutlineArrowForwardIos
                        className="text-gray-400 group-hover:text-white"
                        size={14}
                      />
                    </button>
                  ))}

                  {/* Language Dropdown in Mobile Menu */}
                  <div className="px-4 py-2 border-t border-gray-200 mt-2">
                    <p className="text-xs text-gray-500 mb-2">
                      {t("preferredLanguage")}
                    </p>
                    <div className="relative" ref={mobileLanguageDropdownRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMobileLanguageDropdownOpen(
                            !isMobileLanguageDropdownOpen,
                          );
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#05353A]/10 rounded-full text-[10px] sm:text-xs font-medium text-[#05353A] transition-all hover:bg-[#05353A]/20"
                      >
                        {language === "en" ? "ENG" : "URH"}
                        <svg
                          className={`w-3 h-3 transition-transform ${isMobileLanguageDropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>

                      {isMobileLanguageDropdownOpen && (
                        <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-60">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLanguageSelect("urhobo", e);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${
                              language === "urhobo"
                                ? "bg-white/20 text-white"
                                : "text-gray-300 hover:bg-white/10"
                            }`}
                          >
                            <Image
                              src="/images/urhobo.png"
                              alt="Urhobo"
                              width={14}
                              height={14}
                              className="object-contain"
                            />
                            URH
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLanguageSelect("en", e);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${
                              language === "en"
                                ? "bg-white/20 text-white"
                                : "text-gray-300 hover:bg-white/10"
                            }`}
                          >
                            <Image
                              src="/uk-flag.png"
                              alt="UK flag"
                              width={14}
                              height={14}
                              className="object-contain rounded-sm"
                            />
                            ENG
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleLogOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex self-center text-red-600 mt-3 font-medium hover:underline active:opacity-80 text-sm"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[1.125rem] font-semibold text-[#05353A]"
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        )}

        {/* Modals - Only render if not handled externally */}
        {!renderModalsExternally && (
          <>
            {activeModal === "personalDetails" && (
              <ProfileModal closeModal={closeModal} />
            )}
            {activeModal === "username" && (
              <UsernameModal closeModal={closeModal} />
            )}
            {activeModal === "password" && (
              <PasswordModal closeModal={closeModal} />
            )}
            {activeModal === "delete" && (
              <DeleteAccountModal closeModal={closeModal} />
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
