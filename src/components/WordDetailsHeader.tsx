"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/store/store";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { setLanguage } from "@/slice/changeLangSlice";
import { useRouter, usePathname } from "next/navigation";
import type { WordRecord } from "@/types/word";
import { setSearchQuery, setSearchResults } from "@/slice/wordSlice";
import { Search, Keyboard, X } from "lucide-react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { profileLinks } from "@/types";
import { logoutHandler } from "@/features/auth";
import { useLazyAutocompleteQuery } from "@/slice/endpoints";
import ProfileModal from "./ProfileModal";
import UsernameModal from "./UsernameModal";
import PasswordModal from "./PasswordModal";
import DeleteAccountModal from "./DeleteModal";
import MobileSearchDrawer from "./MobileSearchDrawer";
import ComingSoonModal from "./ComingSoonModal";
import { AnimatePresence } from "framer-motion";

interface WordDetailsHeaderProps {
  searchQuery?: string;
  handleSearchChange?: (query: string) => void;
  isLoading?: boolean;
  handleWordClick?: (word: WordRecord) => void;
  searchRef?: React.RefObject<HTMLDivElement | null>;
  activeModal?: string | null;
  onOpenModal?: (modalName: string) => void;
  onCloseModal?: () => void;
  renderModalsExternally?: boolean;
}

const WordDetailsHeader: React.FC<WordDetailsHeaderProps> = ({
  activeModal,
  onOpenModal,
  onCloseModal,
  renderModalsExternally,
}) => {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const dispatch = useAppDispatch();
  const language = useAppSelector(
    (state: RootState) => state.language.language,
  );
  const { user } = useAppSelector((state) => state.auth);
  const { searchResults } = useAppSelector((state: RootState) => state.word);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileCollapsed, setIsMobileProfileCollapsed] =
    useState(true);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] =
    useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasSyncedFromUrl, setHasSyncedFromUrl] = useState(false);
  const pathname = usePathname();
  const [fetchAutocomplete] = useLazyAutocompleteQuery();

  console.log(isMobile);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load search history
  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);

  const isWordDetailsPage =
    pathname === "/word-display" || pathname === "/newWordDetails";
  // Sync search query with URL term when on word details page (only on mount or URL change)
  useEffect(() => {
    if (isWordDetailsPage) {
      const urlTerm = new URLSearchParams(window.location.search).get("term");
      // Only sync if we haven't synced yet AND (input is empty OR input matches URL term)
      if (
        urlTerm &&
        !hasSyncedFromUrl &&
        (localSearchQuery === "" || localSearchQuery === urlTerm)
      ) {
        setLocalSearchQuery(urlTerm);
        dispatch(setSearchQuery(urlTerm));
        setHasSyncedFromUrl(true);
      }
      // Hide suggestions when navigating to word-display page (unless search is focused)
      if (!isSearchFocused) {
        dispatch(setSearchResults([]));
        setShowResults(false);
        setShowHistory(false);
      }
    } else {
      // Reset sync flag when leaving word-display page
      setHasSyncedFromUrl(false);
    }
  }, [
    pathname,
    dispatch,
    isSearchFocused,
    hasSyncedFromUrl,
    localSearchQuery,
    isWordDetailsPage,
  ]);

  // Save search query to history
  const saveSearchToHistory = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...searchHistory.filter((t) => t !== term)].slice(
      0,
      10,
    );
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const profileRefMobile = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof i18n?.changeLanguage === "function") {
      i18n.changeLanguage(language);
    }
    dispatch(setLanguage(language));
  }, [i18n, dispatch, language]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset profile collapsed state when menu closes
      setIsMobileProfileCollapsed(true);
      setIsMobileLanguageDropdownOpen(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Define navigation links with language-aware routes
  const navLinks = [
    { label: "home", href: language === "en" ? "/home" : "/uwevwi" },
    { label: "about", href: language === "en" ? "/about" : "/kpahe" },
    { label: "Guọnọpedia", href: "/encyclopedia" },
    { label: "donate", href: language === "en" ? "/donate" : "/siobonu" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;

      // Don't interfere with mobile menu interactions
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

      if (
        profileRefMobile.current &&
        !profileRefMobile.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(target)) {
        setShowResults(false);
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Fetch autocomplete suggestions (only when search is focused or when typing)
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Don't fetch suggestions if on word-display page and search is not focused
      if (isWordDetailsPage && !isSearchFocused) {
        return;
      }

      if (localSearchQuery.trim() === "") {
        dispatch(setSearchResults([]));
        setIsLoadingSuggestions(false);
        setShowResults(false);
        if (searchHistory.length > 0 && isSearchFocused) {
          setShowHistory(true);
        }
        return;
      }
      setIsLoadingSuggestions(true);
      setShowResults(true);
      setShowHistory(false);
      try {
        const result = await fetchAutocomplete({
          q: localSearchQuery,
        }).unwrap();
        if (result && typeof result === "object" && "requiresAuth" in result) {
          setShowComingSoonModal(true);
          dispatch(setSearchResults([]));
        } else if (Array.isArray(result)) {
          dispatch(
            setSearchResults(
              result.map((item, index) => ({
                ...item,
                id: typeof item.id === "number" ? item.id : index,
              })),
            ),
          );
        }
      } catch {
        dispatch(setSearchResults([]));
      }
      setIsLoadingSuggestions(false);
    };

    const debounce = setTimeout(() => {
      if (localSearchQuery && (isSearchFocused || !isWordDetailsPage)) {
        fetchSuggestions();
      }
    }, 100);
    return () => clearTimeout(debounce);
  }, [
    localSearchQuery,
    dispatch,
    user,
    searchHistory.length,
    isSearchFocused,
    pathname,
    fetchAutocomplete,
    isWordDetailsPage,
  ]);

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
    i18n.changeLanguage(lang);

    // Close dropdowns
    setIsMobileLanguageDropdownOpen(false);
    setIsLanguageDropdownOpen(false);

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
    setMenuOpen(false);
  };

  const openModal = (modalName: string) => {
    if (onOpenModal) {
      onOpenModal(modalName);
    }
    setIsProfileOpen(false);
    setMenuOpen(false);
  };

  const handleSearchInputChange = (value: string) => {
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
    // When user types, automatically focus the search to show suggestions
    setIsSearchFocused(true);
    if (value.trim()) {
      setShowResults(true);
      setShowHistory(false);
    } else {
      setShowResults(false);
      if (searchHistory.length > 0) {
        setShowHistory(true);
      }
    }
  };

  const handleWordClick = (word: WordRecord) => {
    if (!user) {
      setShowComingSoonModal(true);
      return;
    }
    saveSearchToHistory(word.word);
    dispatch(setSearchQuery(""));
    dispatch(setSearchResults([]));
    setLocalSearchQuery("");
    setShowResults(false);
    setShowHistory(false);
    router.replace(`/newWordDetails?term=${encodeURIComponent(word.word)}`);
  };

  const handleHistoryClick = (term: string) => {
    if (!user) {
      setShowComingSoonModal(true);
      return;
    }
    saveSearchToHistory(term);
    dispatch(setSearchResults([]));
    setLocalSearchQuery("");
    setShowResults(false);
    setShowHistory(false);
    router.replace(`/newWordDetails?term=${encodeURIComponent(term)}`);
  };

  const removeFromHistory = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searchHistory.filter((t) => t !== term);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = localSearchQuery.trim();
    if (query !== "") {
      if (!user) {
        setShowComingSoonModal(true);
        return;
      }
      saveSearchToHistory(query);
      dispatch(setSearchQuery(""));
      dispatch(setSearchResults([]));
      setLocalSearchQuery("");
      setShowResults(false);
      setShowHistory(false);
      // Use replace to update the URL without adding to history, ensuring the page updates
      router.replace(`/newWordDetails?term=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <header className="w-full lg:px-10 ">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-[91px] px-3 py-6 gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/guono-logo.svg"
              alt="guọnọ-logo"
              width="100"
              height="30"
              aria-label="Guọnọ logo"
            />
          </Link>

          {/* Desktop Search Input */}
          <div ref={searchInputRef} className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div
                className={`flex items-center gap-3 rounded-full px-4 py-3 transition-all duration-300 ${
                  localSearchQuery.length
                    ? " text-[#05353A] border-[#8AA5A8]  shadow-[0px_0px_0px_1px_#05353a70]"
                    : "bg- shadow-[0px_0px_0px_1px_#05353a70] text-[#05353a70]"
                }`}
              >
                <Search
                  className={`w-5 h-5 shrink-0 ${
                    localSearchQuery.length
                      ? "text-[#05353a70]"
                      : "text-[#05353a70]"
                  }`}
                />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder={t("searchGuono")}
                  className={`flex-1 bg-transparent text-sm outline-none placeholder:text-[#7b8b8c] focus:outline-none ${
                    localSearchQuery.length
                      ? "text-[#05353A]"
                      : "text-[#05353A]"
                  }`}
                  value={localSearchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchSubmit(
                        e as React.FormEvent<HTMLInputElement>,
                      );
                    }
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (localSearchQuery.trim()) {
                      // Fetch suggestions when focusing if there's a query
                      setShowResults(true);
                      setShowHistory(false);
                    } else if (searchHistory.length > 0) {
                      setShowHistory(true);
                    }
                  }}
                  onBlur={() => {
                    setIsSearchFocused(false);
                    // Delay to allow click events on results
                    setTimeout(() => {
                      // Hide suggestions when blurring on word-display page
                      if (isWordDetailsPage) {
                        setShowResults(false);
                        setShowHistory(false);
                      } else {
                        setShowResults(false);
                        setShowHistory(false);
                      }
                    }, 200);
                  }}
                />
                {!isMobile && <div className="w-px h-3 bg-[#8AA5A8] mx-2" />}
                {localSearchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLocalSearchQuery("");
                      dispatch(setSearchQuery(""));
                      dispatch(setSearchResults([]));
                      setShowResults(false);
                      setHasSyncedFromUrl(true); // Set to true to prevent re-syncing from URL
                      if (searchHistory.length > 0) {
                        setShowHistory(true);
                      }
                    }}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <div className="bg-[#05353A] rounded-full hover:bg-white/20  p-1">
                      <X
                        className={`w-3 h-3 ${localSearchQuery.length ? "text-white" : "text-[#05353a70]"}`}
                      />
                    </div>
                  </button>
                )}
                <Keyboard
                  className={`w-5 h-5 shrink-0 ${
                    localSearchQuery.length
                      ? "text-[#05353A80]"
                      : "text-[#05353a70]/60"
                  }`}
                />
              </div>
            </form>

            {/* Search History Dropdown */}
            <div
              className={`absolute top-full left-0 right-0 mt-2 bg-[#C5D8DA]
    rounded-2xl shadow-lg z-50 max-h-[300px] overflow-y-auto
    transition-all duration-200 ease-out
    ${
      showHistory && !localSearchQuery.trim()
        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
    }
  `}
            >
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  className="flex items-center border-b border-black/5 justify-between px-4 py-2 hover:bg-[#0a2e307e] cursor-pointer transition-all rounded-lg"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur from firing
                    handleHistoryClick(term);
                  }}
                >
                  <span className="text-[#05353A]">{term}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeFromHistory(term, e);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="p-1 rounded-full hover:bg-[#254045] transition-colors"
                  >
                    <div className="bg-[#05353A] rounded-full p-1">
                      <X className="w-4 h-4  text-white " />
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Autocomplete Results Dropdown */}
            <div
              className={`absolute top-full left-0 right-0 mt-2 bg-[#C5D8DA]
    rounded-2xl shadow-lg z-50 overflow-hidden
    transition-all duration-200 ease-out
    ${
      showResults && localSearchQuery.trim()
        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
    }
  `}
            >
              {isLoadingSuggestions ? (
                <div className="p-4 text-center text-gray-400">
                  {t("loading")}
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-4  border-b border-black/5 hover:bg-[#1c4a4d88] cursor-pointer transition-all rounded-lg first:rounded-t-2xl flex items-center last:rounded-b-2xl"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur from firing
                      handleWordClick(result as unknown as WordRecord);
                    }}
                  >
                    <div className="font-semibold text-[#05353A]">
                      {result.word}
                    </div>
                    <div className="w-[0.5px] h-3 bg-black/50 mx-2" />
                    {result.eyuo && (
                      <div className="text-sm text-[#05353A]">
                        {result.eyuo}
                      </div>
                    )}
                  </div>
                ))
              ) : null}
            </div>
          </div>

          {/* Desktop Actions: Profile only */}
          <div className="flex items-center gap-3 shrink-0">
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
                        <p className="font-semibold text-[#05353A]">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {profileLinks.map((link, index) => (
                        <button
                          key={index}
                          onClick={() => openModal(link.modal)}
                          className="group px-4 py-2 text-sm text-gray-700 hover:bg-[#05353A] flex justify-between items-center transition-all duration-200 rounded-lg"
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

                      {/* Language Dropdown in Profile Menu */}
                      <div className="px-4 py-2 border-t border-gray-100 mt-2">
                        <p className="text-xs text-gray-500 mb-2">
                          {t("preferredLanguage")}
                        </p>
                        <div className="relative" ref={languageDropdownRef}>
                          <button
                            onClick={() =>
                              setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                            }
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#05353A]/10 rounded-full text-[10px] sm:text-xs font-medium text-[#05353A] transition-all hover:bg-[#05353A]/20"
                          >
                            {language === "en" ? "ENG" : "URH"}
                            <svg
                              className={`w-3 h-3 transition-transform ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
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

                          {isLanguageDropdownOpen && (
                            <div className="absolute bottom-full mb-2 right-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                              <button
                                onClick={() => handleLanguageSelect("urhobo")}
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
                                onClick={() => handleLanguageSelect("en")}
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
        </div>

        {/* Mobile Layout - Google Style */}
        <div className="md:hidden pt-5">
          {/* Top Row: Logo and Profile */}
          <div className="flex justify-between items-center px-3 py-3 relative">
            {/* Logo - Centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="shrink-0">
                <Image
                  src="/guono-logo.svg"
                  alt="guọnọ-logo"
                  width="100"
                  height="30"
                  aria-label="Guọnọ logo"
                />
              </Link>
            </div>

            {/* Profile Image - Replaces Hamburger */}
            <div className="ml-auto">
              {user ? (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center justify-center rounded-full hover:opacity-90 transition-all focus:outline-none"
                  aria-label="Toggle Menu"
                >
                  <Image
                    src="/man.png"
                    alt="User profile"
                    className="rounded-full border-2 border-[#05353A]/30"
                    width={36}
                    height={36}
                  />
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center justify-center gap-2 bg-[#05353A] text-white py-2 px-4 rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Row: Search Bar */}
          <div
            className="px-3 pb-3 pt-4 cursor-pointer"
            onClick={() => setShowMobileDrawer(true)}
          >
            <div className="flex items-center gap-3 rounded-full px-4 py-3  shadow-[0px_0px_0px_1px_#05353a70] text-[#05353a70]">
              <Search className="w-5 h-5 shrink-0 text-[#05353a70]" />
              <span className="flex-1 text-sm text-[#7b8b8c]">
                {t("searchGuono")}
              </span>
              <div className="w-[0.5px] h-3 bg-black/50 mx-2" />

              <Keyboard className="w-5 h-5 shrink-0 text-[#05353a70]/60" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && user && (
        <div
          className="md:hidden fixed inset-0 bg-[#f2feff] z-50 flex flex-col px-3 py-4 space-y-6"
          data-mobile-menu
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar with logo and close button */}
          <div className="flex justify-between items-center mt-4 mb-8">
            <Link href="/" onClick={() => setMenuOpen(false)}>
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
              onClick={() => setMenuOpen(false)}
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

          {/* Mobile Search Bar in Menu - Opens Drawer */}
          {/* <div 
            className="cursor-pointer"
            onClick={() => {
              setMenuOpen(false);
              setShowMobileDrawer(true);
            }}
          >
            <div className="flex items-center gap-3 rounded-full px-4 py-3 bg-white shadow-[0px_0px_0px_1px_#05353a70] text-[#05353a70]">
              <Search className="w-5 h-5 shrink-0 text-[#05353a70]" />
              <span className="flex-1 text-sm text-[#7b8b8c]">{t("searchGuono")}</span>
              <Keyboard className="w-5 h-5 shrink-0 text-[#05353a70]/60" />
            </div>
          </div> */}

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
                      setMenuOpen(false);
                    }}
                    className="group px-4 py-2 text-sm text-gray-700 hover:bg-[#05353A] active:bg-[#05353A] flex justify-between items-center transition-all duration-200 rounded-lg w-full"
                  >
                    <span className="group-hover:text-white">{t(link.t)}</span>
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
              onClick={() => setMenuOpen(false)}
              className="text-[1.125rem] font-semibold text-[#05353A]"
            >
              {t(link.label)}
            </Link>
          ))}
        </div>
      )}

      {/* Modals */}
      {!renderModalsExternally && (
        <>
          {activeModal === "personalDetails" && (
            <ProfileModal closeModal={onCloseModal ? onCloseModal : () => {}} />
          )}
          {activeModal === "username" && (
            <UsernameModal
              closeModal={onCloseModal ? onCloseModal : () => {}}
            />
          )}
          {activeModal === "password" && (
            <PasswordModal
              closeModal={onCloseModal ? onCloseModal : () => {}}
            />
          )}
          {activeModal === "delete" && (
            <DeleteAccountModal
              closeModal={onCloseModal ? onCloseModal : () => {}}
            />
          )}
        </>
      )}

      <AnimatePresence>
        {showMobileDrawer && (
          <MobileSearchDrawer
            isOpen={showMobileDrawer}
            onClose={() => setShowMobileDrawer(false)}
            showKeyboard={false}
            setShowKeyboard={() => {}}
          />
        )}
      </AnimatePresence>

      {showComingSoonModal && (
        <ComingSoonModal closeModal={() => setShowComingSoonModal(false)} />
      )}
    </>
  );
};

export default WordDetailsHeader;
