"use client";

import { useInitTranslation } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function JoinTheUrhoboWorld() {
  const { t } = useTranslation("common");
  return (
    <section className="relative py-16 sm:py-20 bg-[#FBF5EA] max-w-[1253px] mx-auto rounded-2xl overflow-hidden">
      {/* Floating vectors - decorative */}
      <div
        className="absolute top-30 right-50 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 opacity-80 pointer-events-none"
        aria-hidden
      >
        <Image
          src="/vector2.svg"
          alt=""
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </div>
      <div
        className="absolute bottom-8 left-4 sm:left-8 w-20 h-14 sm:w-28 sm:h-20 opacity-60 pointer-events-none"
        aria-hidden
      >
        <Image
          src="/Vector-4.svg"
          alt=""
          width={146}
          height={97}
          className="w-full h-full object-contain object-left-bottom"
        />
      </div>
      <div
        className="absolute top-0 right-0 sm:right-8 w-14 h-12 sm:w-20 sm:h-16 opacity-70 pointer-events-none"
        aria-hidden
      >
        <Image
          src="/vector-1.svg"
          alt=""
          width={98}
          height={80}
          className="w-full h-full object-contain"
        />
      </div>
      <div
        className="absolute top-50 right-0 sm:right-8 w-14 h-12 sm:w-20 sm:h-16 opacity-70 pointer-events-none"
        aria-hidden
      >
        <Image
          src="/Vector.svg"
          alt="Guọnọ Logo"
          width={100}
          height={30}
          className="object-contain"
        />
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6 sm:gap-8">
          <Image
            src="/guono-logo.svg"
            alt="Guọnọ Logo"
            width={100}
            height={30}
            className="object-contain"
          />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
            {t("joinTheUrhoboWorld")}
          </h2>
          <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">
            {t("joinTheUrhoboWorldDescription")}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex h-12 sm:h-[58px] px-6 sm:px-8 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2 focus-visible:ring-offset-2"
            >
              {t("getStarted")}
            </Link>
            {/* <Link
                            href="/careers"
                            className="w-full sm:w-auto inline-flex text-[#02474F] h-12 sm:h-[58px] px-6 sm:px-8 items-center justify-center rounded-lg bg-white text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2 focus-visible:ring-offset-2"
                        >
                            Apply as a Contributor
                        </Link> */}
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <p className="text-sm text-foreground/70">
              {t("availableToDownloadOn")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a
                href="https://apps.apple.com/ng/app/6744582441"
                className="inline-flex items-center gap-2 sm:gap-3 h-11 sm:h-12 pl-3 sm:pl-4 pr-4 sm:pr-5 rounded-[10px] bg-black text-white border border-white/20 hover:opacity-90 transition-opacity shadow-sm"
                aria-label="Download on the App Store"
              >
                <Image
                  src="/apple-white1.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
                />
                <span className="flex flex-col items-start leading-tight text-left">
                  <span className="text-[9px] sm:text-[10px] font-normal">
                    {t("downloadOnThe")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold -mt-0.5">
                    App Store
                  </span>
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.guono.mobile"
                className="inline-flex items-center gap-2 sm:gap-3 h-11 sm:h-12 pl-3 sm:pl-4 pr-4 sm:pr-5 rounded-[10px] bg-black text-white border border-white/20 hover:opacity-90 transition-opacity shadow-sm"
                aria-label="GET IT ON Google Play"
              >
                <Image
                  src="/icons8-google-play.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
                />
                <span className="flex flex-col items-start leading-tight text-left">
                  <span className="text-[9px] sm:text-[10px] font-normal">
                    {t("getItOn")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold -mt-0.5">
                    Google Play
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
