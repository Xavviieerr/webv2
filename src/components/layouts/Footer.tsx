"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { RootState } from "@/store/store";
import { languageStore, setLanguage } from "@/slice/changeLangSlice";
import i18n from "@/lib/i18n";
import Logo from "../ui/Logo";
import Image from "next/image";

// Navigation links will be generated dynamically based on language
const getNavLinks = (language: "en" | "urhobo") => [
  { label: "home", href: language === "en" ? "/home" : "/uwevwi" },
  { label: "about", href: language === "en" ? "/about" : "/kpahe" },
  { label: "donate", href: language === "en" ? "/donate" : "/siobonu" },
];

const legalLinks = [
  { label: "termsAndConditions", href: "/terms" },
  { label: "privacyPolicy", href: "/privacy" },
];

const socialLinks = [
  {
    href: "https://x.com/guono_dict/",
    // img: "/icons/x-icon.png",
    svg: () => (
      <svg
        width="30"
        height="31"
        viewBox="0 0 30 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.36116 0.960938C2.02842 0.960938 0.131836 2.85752 0.131836 5.19026V26.3369C0.131836 28.6696 2.02842 30.5662 4.36116 30.5662H25.5078C27.8405 30.5662 29.7371 28.6696 29.7371 26.3369V5.19026C29.7371 2.85752 27.8405 0.960938 25.5078 0.960938H4.36116ZM23.9945 6.51192L17.135 14.3494L25.2038 25.0152H18.8862L13.9432 18.5457L8.27989 25.0152H5.14094L12.4762 16.6293L4.73783 6.51192H11.214L15.6878 12.4264L20.8555 6.51192H23.9945ZM21.4965 23.1385L10.269 8.28956H8.39884L19.7519 23.1385H21.4899H21.4965Z"
          fill="white"
        />
      </svg>
    ),
    alt: "X (Twitter) icon",
    aria: "Follow Guọnọ on X (Twitter)",
  },
  {
    href: "https://www.instagram.com/guono_urhobo_dictionary",
    img: "/icons/instagram-icon.svg",
    svg: () => (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.2851 2.96094C20.9504 2.96538 21.7957 2.97426 22.5254 2.99498L22.8126 3.00535C23.1442 3.01719 23.4713 3.03199 23.8666 3.04975C25.4416 3.12377 26.5162 3.37245 27.4592 3.73808C28.4361 4.11406 29.2592 4.62327 30.0822 5.44482C30.8352 6.18455 31.4177 7.07973 31.7889 8.06784C32.1546 9.01077 32.4032 10.0854 32.4772 11.6619C32.495 12.0557 32.5098 12.3828 32.5217 12.7159L32.5305 13.003C32.5527 13.7313 32.5616 14.5766 32.5646 16.2419L32.5661 17.3461V19.2853C32.5697 20.365 32.5583 21.4447 32.532 22.5241L32.5231 22.8113C32.5113 23.1443 32.4965 23.4715 32.4787 23.8652C32.4047 25.4417 32.1531 26.5149 31.7889 27.4593C31.4177 28.4474 30.8352 29.3426 30.0822 30.0823C29.3424 30.8353 28.4473 31.4178 27.4592 31.7891C26.5162 32.1547 25.4416 32.4034 23.8666 32.4774L22.8126 32.5218L22.5254 32.5307C21.7957 32.5514 20.9504 32.5618 19.2851 32.5647L18.1809 32.5662H16.2432C15.163 32.57 14.0828 32.5587 13.0029 32.5322L12.7157 32.5233C12.3643 32.51 12.013 32.4947 11.6618 32.4774C10.0868 32.4034 9.01212 32.1547 8.06771 31.7891C7.08012 31.4176 6.18547 30.8351 5.44616 30.0823C4.69263 29.3427 4.10965 28.4475 3.73794 27.4593C3.37232 26.5164 3.12363 25.4417 3.04962 23.8652L3.00521 22.8113L2.99781 22.5241C2.97052 21.4447 2.95819 20.365 2.9608 19.2853V16.2419C2.95671 15.1622 2.96756 14.0824 2.99337 13.003L3.00373 12.7159C3.01557 12.3828 3.03038 12.0557 3.04814 11.6619C3.12215 10.0854 3.37084 9.01225 3.73646 8.06784C4.10903 7.07932 4.69304 6.18412 5.44764 5.44482C6.18652 4.69218 7.08065 4.10973 8.06771 3.73808C9.01212 3.37245 10.0853 3.12377 11.6618 3.04975C12.0555 3.03199 12.3842 3.01719 12.7157 3.00535L13.0029 2.99646C14.0823 2.97016 15.162 2.95881 16.2417 2.96242L19.2851 2.96094ZM17.7634 10.3623C15.8005 10.3623 13.9179 11.142 12.5299 12.53C11.1419 13.9181 10.3621 15.8006 10.3621 17.7636C10.3621 19.7265 11.1419 21.6091 12.5299 22.9971C13.9179 24.3851 15.8005 25.1649 17.7634 25.1649C19.7264 25.1649 21.6089 24.3851 22.997 22.9971C24.385 21.6091 25.1647 19.7265 25.1647 17.7636C25.1647 15.8006 24.385 13.9181 22.997 12.53C21.6089 11.142 19.7264 10.3623 17.7634 10.3623ZM17.7634 13.3228C18.3466 13.3227 18.9241 13.4375 19.4629 13.6605C20.0017 13.8836 20.4913 14.2106 20.9038 14.6229C21.3162 15.0352 21.6434 15.5247 21.8666 16.0635C22.0899 16.6022 22.2049 17.1797 22.205 17.7628C22.2051 18.346 22.0903 18.9235 21.8672 19.4623C21.6441 20.0011 21.3171 20.4907 20.9048 20.9032C20.4925 21.3156 20.003 21.6428 19.4643 21.866C18.9255 22.0893 18.3481 22.2043 17.7649 22.2044C16.5871 22.2044 15.4576 21.7365 14.6248 20.9037C13.792 20.0709 13.3241 18.9413 13.3241 17.7636C13.3241 16.5858 13.792 15.4563 14.6248 14.6235C15.4576 13.7906 16.5871 13.3228 17.7649 13.3228M25.5363 8.14186C25.0456 8.14186 24.5749 8.3368 24.2279 8.68381C23.8809 9.03081 23.686 9.50145 23.686 9.99219C23.686 10.4829 23.8809 10.9536 24.2279 11.3006C24.5749 11.6476 25.0456 11.8425 25.5363 11.8425C26.027 11.8425 26.4977 11.6476 26.8447 11.3006C27.1917 10.9536 27.3866 10.4829 27.3866 9.99219C27.3866 9.50145 27.1917 9.03081 26.8447 8.68381C26.4977 8.3368 26.027 8.14186 25.5363 8.14186Z"
          fill="white"
        />
      </svg>
    ),
    alt: "Instagram icon",
    aria: "Follow Guọnọ on Instagram",
  },
  {
    href: "https://web.facebook.com/profile.php?id=61561435329870#",
    // img: "/icons/facebook-icon.svg",
    svg: () => (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M33.0398 17.7636C33.0398 9.59252 26.4083 2.96094 18.2372 2.96094C10.0661 2.96094 3.43457 9.59252 3.43457 17.7636C3.43457 24.928 8.52668 30.8935 15.2767 32.2701V22.2044H12.3161V17.7636H15.2767V14.0629C15.2767 11.206 17.6007 8.88199 20.4576 8.88199H24.1583V13.3228H21.1977C20.3836 13.3228 19.7175 13.9889 19.7175 14.803V17.7636H24.1583V22.2044H19.7175V32.4922C27.1928 31.7521 33.0398 25.4461 33.0398 17.7636Z"
          fill="white"
        />
      </svg>
    ),
    alt: "Facebook icon",
    aria: "Follow Guọnọ on Facebook",
  },
];

const Footer = () => {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const language = useAppSelector(
    (state: RootState) => state.language.language,
  );
  const navLinks = getNavLinks(language);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lang = languageStore.getLang();
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }
    dispatch(setLanguage(lang));
  }, [pathname, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isMobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileDropdownOpen]);

  const handleLanguageToggle = (lang: "en" | "urhobo") => {
    dispatch(setLanguage(lang));
    if (typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(lang);
    }
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);

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
  const year = new Date().getFullYear();

  return (
    <footer
      className=" bg-[#05353A] text-white py-10 px-4 lg:px-16 relative z-100"
      aria-labelledby="footer-heading"
    >
      <div className="max-w-[1700px] mx-auto w-full">
        <section className="flex flex-col md:flex-row justify-between">
          {/* Brand Section */}
          <div className="flex justify-between md:flex-col">
            <div className="mb-6 md:mb-0">
              <Logo />
              <p className="mt-4 text-lg">
                {t("revivingLanguageAndCulture")}
                <br />
                {t("Eyeyono")}
              </p>
            </div>
            <p className="hidden md:flex items-center mt-26 text-sm">
              <span className="text-xl mr-2" aria-hidden="true">
                ©
              </span>
              <span>{year} Guọnọ</span>
              <span className="mx-2">{t("allRightsReserved")}</span>
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick Links">
            <h3 className="text-2xl font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-lg">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:underline focus:underline focus:outline-none"
                    aria-label={`Navigate to ${link.label} page`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* <nav aria-label="Career Possibilities">
            <h3 className="text-2xl font-semibold mb-4">{t("careerPossibilities")}</h3>
            <ul className="space-y-2 text-lg">
              <li>
                <Link href="/careers">
                  Contributors
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  Tutors
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  Translators
                </Link>
              </li>
            </ul>
          </nav> */}

          {/* Support Section */}
          <div className="mt-6 md:mt-0">
            <h3 className="text-2xl font-semibold mb-4">{t("support")}</h3>
            <div
              className="flex items-center space-x-4 mb-6"
              aria-label="Social media links"
            >
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  aria-label={social.aria}
                  className="focus:outline-none rounded-full"
                >
                  {social.svg ? (
                    <social.svg />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={social.img}
                      alt={social.alt}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>
            {/* Language Dropdown - Desktop only, always visible */}
            <div className="hidden md:block mt-6">
              <p className="text-sm text-gray-300 mb-2">
                {t("preferredLanguage")}
              </p>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium transition-all hover:bg-white/20"
                >
                  {language === "en" ? "ENG" : "URH"}
                  <svg
                    className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
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

                {isDropdownOpen && (
                  <div className="absolute bottom-full mb-2 left-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                    <button
                      onClick={() => handleLanguageToggle("en")}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                        language === "en"
                          ? "bg-white/20 text-white"
                          : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <Image
                        src="/uk-flag.png"
                        alt="UK flag"
                        width={16}
                        height={16}
                        className="object-contain rounded-sm"
                      />
                      ENG
                    </button>
                    <button
                      onClick={() => handleLanguageToggle("urhobo")}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                        language === "urhobo"
                          ? "bg-white/20 text-white"
                          : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <Image
                        src="/images/urhobo.png"
                        alt="Urhobo"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      URH
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              className="hidden md:flex md:flex-col lg:flex-row mt-20 gap-4 text-sm underline"
              aria-label="Legal information"
            >
              {legalLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="focus:underline focus:outline-none"
                  aria-label={`View ${link.label.toLowerCase()}`}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile Legal & Copyright */}
        <section className="flex flex-col md:hidden">
          {/* Language Dropdown - Mobile only */}
          <div className="mb-6">
            <p className="text-sm text-gray-300 mb-2">
              {t("preferredLanguage")}
            </p>
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium transition-all hover:bg-white/20"
              >
                {language === "en" ? "ENG" : "URH"}
                <svg
                  className={`w-3 h-3 transition-transform ${isMobileDropdownOpen ? "rotate-180" : ""}`}
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

              {isMobileDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 bg-[#05353A] border border-[#254045] rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                  <button
                    onClick={() => handleLanguageToggle("en")}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                      language === "en"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <Image
                      src="/uk-flag.png"
                      alt="UK flag"
                      width={16}
                      height={16}
                      className="object-contain rounded-sm"
                    />
                    ENG
                  </button>
                  <button
                    onClick={() => handleLanguageToggle("urhobo")}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                      language === "urhobo"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <Image
                      src="/images/urhobo.png"
                      alt="Urhobo"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                    URH
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className="flex flex-col gap-4 text-sm underline"
            aria-label="Legal information"
          >
            {legalLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="focus:underline focus:outline-none"
                aria-label={`View ${link.label.toLowerCase()}`}
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
          <div className="flex items-center text-center text-sm mt-10">
            <p>
              <span className="text-xl mr-2" aria-hidden="true">
                ©
              </span>
              <span>{year} Guọnọ</span>
              <span className="mx-2">{t("allRightsReserved")}</span>
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
