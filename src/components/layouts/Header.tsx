import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiaTimesSolid } from "react-icons/lia";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store/store";
import { setLanguage } from "@/slice/changeLangSlice";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { logoutHandler } from "@/features/auth";
import ProfileModal from "../ProfileModal";
import UsernameModal from "../UsernameModal";
import PasswordModal from "../PasswordModal";
import DeleteAccountModal from "../DeleteModal";
import { profileLinks } from "@/types";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] = useState(false);
  const [isMobileProfileCollapsed, setIsMobileProfileCollapsed] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  // Grab current language from Redux
  const language = useAppSelector((state: RootState) => state.language.language);
  // Get user from Redux
  const { user } = useAppSelector((state) => state.auth);

  const profileRef = useRef<HTMLDivElement>(null);
  const profileRefMobile = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);




  // Define navigation links with language-aware routes
  const navLinks = [
    { label: "home", href: language === "en" ? "/home" : "/uwevwi" },
    { label: "about", href: language === "en" ? "/about" : "/kpahe" },
    { label: "Guọnọpedia", href: "/encyclopedia" },
    { label: "donate", href: language === "en" ? "/donate" : "/siobonu" },
  ];

  useEffect(() => {
    // if (router.pathname === "/" && i18n.language !== "urhobo") {
    i18n.changeLanguage(language);
    dispatch(setLanguage(language)); // Ensure Redux state is also updated
    // }
  }, [i18n, dispatch, language]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutsideProfile =
        (!profileRef.current || !profileRef.current.contains(target)) &&
        (!profileRefMobile.current || !profileRefMobile.current.contains(target));
      const isOutsideLanguageDropdown =
        (!languageDropdownRef.current || !languageDropdownRef.current.contains(target)) &&
        (!mobileLanguageDropdownRef.current || !mobileLanguageDropdownRef.current.contains(target));

      if (isOutsideProfile) {
        setIsProfileOpen(false);
      }
      if (isOutsideLanguageDropdown) {
        setIsLanguageDropdownOpen(false);
        setIsMobileLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: "en" | "urhobo") => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
    setIsMobileLanguageDropdownOpen(false);

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
  };

  const handleLogOut = () => {
    logoutHandler();
    router.push("/home");
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
    setIsProfileOpen(false);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <header className="max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center h-[91px] px-3 py-6">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/guono-logo.svg"
            alt="guọnọ-logo"
            width="100"
            height="30"
            aria-label="Guọnọ logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex justify-between items-center space-x-6"
          aria-label="Main navigation"
        >
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`text-[1.125rem] text-[#05353A] ${pathname === link.href ? "font-bold" : "font-normal"
                } hover:opacity-90 transition-opacity`}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions: Profile only */}
        <div className="hidden md:flex items-center gap-3">
          {/* Profile / Login */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center rounded-full hover:opacity-90 transition-all"
              >
                <Image
                  src="/man.png"
                  alt="User profile"
                  className="rounded-full border-2 border-[#05353A]/30"
                  width={40}
                  height={40}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50">
                  <div className="flex flex-col">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-2">
                      <p className="font-semibold text-[#05353A]">{user?.username || "User"}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {profileLinks.map((link, index) => (
                      <button
                        key={index}
                        onClick={() => openModal(link.modal)}
                        className="group px-4 py-2 text-sm text-gray-700 hover:bg-[#05353A] flex justify-between items-center transition-all duration-200 rounded-lg"
                      >
                        <span className="group-hover:text-white">{t(link.t)}</span>
                        <MdOutlineArrowForwardIos
                          className="text-gray-400 group-hover:text-white"
                          size={14}
                        />
                      </button>
                    ))}

                    {/* Language Dropdown in Profile Menu */}
                    <div className="px-4 py-2 border-t border-gray-100 mt-2">
                      <p className="text-xs text-gray-500 mb-2">{t("preferredLanguage")}</p>
                      <div className="relative" ref={languageDropdownRef}>
                        <button
                          onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#05353A]/10 rounded-full text-[10px] sm:text-xs font-medium text-[#05353A] transition-all hover:bg-[#05353A]/20"
                        >
                          {language === "en" ? "ENG" : "URH"}
                          <svg
                            className={`w-3 h-3 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>

                        {isLanguageDropdownOpen && (
                          <div className="absolute bottom-full mb-2 right-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                            <button
                              onClick={() => handleLanguageSelect("urhobo")}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${language === "urhobo"
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
                              onClick={() => handleLanguageSelect("en")}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${language === "en"
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
                      onClick={handleLogOut}
                      className="flex self-center text-red-600 mt-3 font-medium hover:underline text-sm"
                    >
                      {t("logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center justify-center gap-2 bg-[#05353A] text-white py-2 px-4 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
            >
              {t("login")}
            </Link>
          )}
        </div>

        {/* Mobile: Show Profile Icon instead of Hamburger */}
        <div className="md:hidden">
          {user ? (
            <div className="relative" ref={profileRefMobile}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsOpen(!isOpen);
                }}
                className="flex items-center justify-center rounded-full hover:opacity-90 transition-all"
                aria-label="Toggle Profile Menu"
              >
                <Image
                  src="/man.png"
                  alt="User profile"
                  className="rounded-full border-2 border-[#05353A]/30"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex items-center justify-center gap-2 bg-[#05353A] text-white py-2 px-4 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
            >
              {t("login")}
            </Link>
          )}
        </div>

        {/* Mobile Dropdown Menu - Full Screen */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-[#f2feff] z-50 flex flex-col px-3 py-4 space-y-6">
            {/* Top bar with logo and close button */}
            <div className="flex justify-between items-center mt-4 mb-8">
              <Link href={user ? "/home" : "/"}>
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
                onClick={() => {
                  setIsOpen(false);
                  setIsProfileOpen(false);
                }}
                aria-label="Close Menu"
              >
                <LiaTimesSolid className="w-6 h-6 text-[#05353A]" />
              </button>
            </div>
            
            {user ? (
              <div className="space-y-4">
                {/* Collapsible User Profile Header */}
                <button
                  onClick={() => setIsMobileProfileCollapsed(!isMobileProfileCollapsed)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-[#05353A] text-lg">{user?.username || "User"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-[#05353A] transition-transform ${isMobileProfileCollapsed ? "" : "rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Collapsible Profile Content */}
                {!isMobileProfileCollapsed && (
                  <div className="space-y-4">
                    {profileLinks.map((link, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          openModal(link.modal);
                          setIsOpen(false);
                          setIsProfileOpen(false);
                        }}
                        className="group px-4 py-2 text-sm text-gray-700 hover:bg-[#05353A] flex justify-between items-center transition-all duration-200 rounded-lg w-full"
                      >
                        <span className="group-hover:text-white">{t(link.t)}</span>
                        <MdOutlineArrowForwardIos
                          className="text-gray-400 group-hover:text-white"
                          size={14}
                        />
                      </button>
                    ))}

                    {/* Language Dropdown in Mobile Profile Menu */}
                    <div className="px-4 py-2 border-t border-gray-200 mt-2">
                      <p className="text-xs text-gray-500 mb-2">{t("preferredLanguage")}</p>
                      <div className="relative" ref={mobileLanguageDropdownRef}>
                        <button
                          onClick={() => setIsMobileLanguageDropdownOpen(!isMobileLanguageDropdownOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#05353A]/10 rounded-full text-[10px] sm:text-xs font-medium text-[#05353A] transition-all hover:bg-[#05353A]/20"
                        >
                          {language === "en" ? "ENG" : "URH"}
                          <svg
                            className={`w-3 h-3 transition-transform ${isMobileLanguageDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>

                        {isMobileLanguageDropdownOpen && (
                          <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-[60]">
                            <button
                              onClick={() => handleLanguageSelect("urhobo")}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${language === "urhobo"
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
                              onClick={() => handleLanguageSelect("en")}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium transition-all ${language === "en"
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
                      onClick={() => {
                        handleLogOut();
                        setIsOpen(false);
                        setIsProfileOpen(false);
                      }}
                      className="flex self-center text-red-600 mt-3 font-medium hover:underline text-sm"
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="flex items-center justify-center gap-2 bg-[#05353A] text-white py-3 rounded-lg w-full hover:opacity-90 transition"
              >
                {t("login")}
              </Link>
            )}

            {/* Navigation Links */}
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => {
                  setIsOpen(false);
                  setIsProfileOpen(false);
                }}
                className="text-[1.125rem] font-semibold text-[#05353A]"
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        )}

        {/* Modals */}
        {activeModal === "personalDetails" && <ProfileModal closeModal={closeModal} />}
        {activeModal === "username" && <UsernameModal closeModal={closeModal} />}
        {activeModal === "password" && <PasswordModal closeModal={closeModal} />}
        {activeModal === "delete" && <DeleteAccountModal closeModal={closeModal} />}
      </div>
    </header>
  );
}

export default Header;
