"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { JoinTheUrhoboWorld } from "../newlayout/jointheurhoboWorld";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { contributeIcon, engageIcon, exploreIcon } from "./icons";
import { useInitTranslation } from "@/hooks";

const ClassesSection = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <section className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-16">
      <div className="max-w-[1700px] mx-auto w-full lg:px-10">
        <div className="flex flex-col gap-5 rounded-2xl bg-[#FBF5EA] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-[#9A3B00] sm:text-sm">
              {t("personalClasses")}
            </span>
            <h2 className="max-w-xl text-2xl font-semibold leading-tight text-foreground sm:text-3xl lg:text-4xl">
              {t("classesCardTitle")}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              {t("classesCardDescription")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => router.push("/classes")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-8"
            >
              {t("exploreClasses")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroSection = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <section className="min-h-0 py-10 px-4 lg:px-16 sm:py-12 lg:min-h-[85vh] lg:py-0 flex items-center relative">
      {/* dots - hug left on mobile; desktop unchanged */}
      <div
        className="absolute left-0 bottom-0 w-[200px] h-[100px] sm:w-[240px] sm:h-[110px] lg:left-[-100px] lg:w-[280px] lg:h-[132px] z-0"
        aria-hidden
      >
        <Image
          src="/dots.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 240px, 280px"
          className="object-cover object-bottom-left"
        />
      </div>

      <div className="max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left column - text and CTAs (first on mobile, left on desktop) */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 order-1 lg:order-1 w-full max-w-2xl">
            {/* Introductory line - colored spans */}
            <p className="text-sm sm:text-[16px] lg:text-base text-foreground/90 border border-gray-200 lg:border-2 italic rounded-lg p-2 w-fit">
              <span className="font-medium">
                <span className="text-[#009933]">{t("learn")}</span>{" "}
                {t("theLanguage")}.
              </span>{" "}
              <span className="font-medium">
                <span className="text-[#1293EC]">{t("share")}</span>{" "}
                {t("theCulture")}.
              </span>{" "}
              <span className="font-medium">
                <span className="text-[#FF5634]">{t("connect")}</span>{" "}
                {t("theHeritage")}.
              </span>
            </p>

            {/* Main headline - desktop sizes unchanged */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] xl:text-[3.25rem] font-semibold leading-tight tracking-tight">
              <span className="text-[#02474F]">{t("revivingUrhobo")}. </span>{" "}
              <span className="text-primary-2">{t("connectingPeople")}.</span>
            </h1>

            {/* Descriptive paragraph */}
            <p className="text-sm sm:text-base lg:text-lg text-foreground/85 max-w-xl leading-relaxed">
              {t("guonoIsADigitalPlatform")}.
            </p>

            {/* CTA buttons - full width on mobile only */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Button
                onClick={() => router.push("/signup")}
                className="w-full sm:w-auto inline-flex h-12 sm:h-[58px] lg:w-[237px] items-center justify-center rounded-lg 
                  bg-primary px-6 sm:px-8 text-sm font-medium text-white
                  transition-colors cursor-pointer
                  hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-primary-2 focus-visible:ring-offset-2"
              >
                {t("getStarted")}
              </Button>
            </div>

            {/* App download section */}
            <div id="download" className="relative">
              <div className="relative z-10">
                <p className="text-xs sm:text-sm text-foreground/70 mb-2 sm:mb-3">
                  {t("availableToDownloadOn")}:
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
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
                    <span className="flex flex-col items-start leading-tight">
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
                    <span className="flex flex-col items-start leading-tight">
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

          {/* Right column - illustration (second on mobile, right on desktop) */}
          <div className="relative order-2 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-h-[727px] sm:max-w-lg lg:w-[561px] aspect-4/5 lg:aspect-5/6 lg:h-[727px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/guono-hero.png"
                alt="Person climbing a palm tree in a village setting — Reviving Urhobo culture"
                fill
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SupportSection = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <section className="py-10 sm:py-14 lg:py-24 px-4 sm:px-6 lg:px-16">
      <div className="max-w-[1700px] mx-auto w-full lg:px-10">
        <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-8 sm:gap-10 lg:gap-10">
          {/* Left - label, heading, CTA (first on mobile, left on desktop) */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-6 order-1 lg:order-1 w-full max-w-140">
            <span className="text-sm sm:text-base lg:text-[18px] font-normal uppercase tracking-wide text-foreground">
              {t("donate")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
              {t("supportUrh")}
              {/* <br className="hidden sm:block" /> {t("language")} &{" "}
              {t("culture")} */}
            </h2>
            <div className="pt-2">
              <Button
                onClick={() => router.push("/signup")}
                className="w-full sm:w-auto inline-flex h-12 sm:h-[58px] lg:w-[237px] items-center justify-center rounded-lg bg-primary px-6 sm:px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2 focus-visible:ring-offset-2"
              >
                {t("getStarted")}
              </Button>
            </div>
          </div>
          {/* Right - hands image (second on mobile, right on desktop) */}
          <div className="relative w-full lg:w-full overflow-hidden bg-white rounded-xl sm:rounded-2xl order-2 lg:order-2 max-w-2xl lg:max-w-none">
            <Image
              src="/guono-cut.jpg"
              alt="Handprints with heart — support Urhobo language and culture"
              width={704}
              height={283}
              className="w-full h-auto object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const WorkWithPurposeSection = () => {
  const router = useRouter();
  return (
    <section className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-16 relative overflow-hidden min-h-0">
      {/* Decorative rec - scale with container; hidden on small screens */}
      <div
        className="absolute left-0 bottom-0 w-[25vw] max-w-[200px] h-[30vw] max-h-[240px] sm:max-w-[280px] sm:max-h-[340px] lg:-left-24 lg:w-[min(532px,33vw)] lg:h-[min(532px,33vw)] z-0 hidden sm:block"
        aria-hidden
      >
        <Image
          src="/guono-rec.svg"
          alt=""
          fill
          sizes="(max-width: 1024px) 280px, 532px"
          className="object-cover object-left"
        />
      </div>
      {/* Decorative ellipse - scale with viewport */}
      <div
        className="absolute right-0 bottom-0 w-[min(240px,50vw)] h-[min(240px,50vw)] sm:w-[min(320px,45vw)] sm:h-[min(320px,45vw)] lg:w-[min(600px,40vw)] lg:h-[min(400px,28vw)] z-0"
        aria-hidden
      >
        <Image
          src="/Ellipse.svg"
          alt=""
          width={600}
          height={400}
          className="w-full h-full object-contain object-top-right"
        />
      </div>

      <div className="max-w-[1700px] mx-auto w-full px-0 sm:px-2 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-14 justify-between items-center min-w-0">
          {/* Left - image (second on mobile, left on desktop); flexible height */}
          <div className="relative w-full min-w-0 max-w-[600px] mx-auto lg:mx-0 aspect-4/3 lg:aspect-auto lg:h-[min(400px,40vh)] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shrink-0 order-2 lg:order-1 lg:w-full">
            <Image
              src="/guono-community.jpg"
              alt="Team collaborating — work with purpose at Guọnọ"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right - label, heading, description, CTA (first on mobile, right on desktop) */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 order-1 lg:order-2 min-w-0">
            <span className="text-xs sm:text-sm lg:text-base xl:text-lg font-normal text-[#292929] uppercase tracking-widest">
              CAREER & CONTRIBUTOR PROGRAM
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground leading-tight wrap-break-word">
              Work with purpose
            </h2>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-foreground/85 leading-relaxed max-w-xl min-w-0">
              Join Guọnọ as a translator, researcher, or cultural contributor.
              Help translate, document, and grow Urhobo content across languages
              while making a meaningful impact.
            </p>
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2">
              <Button
                onClick={() => router.push("/careers")}
                className="w-full sm:w-auto min-w-0 inline-flex cursor-pointer h-11 sm:h-12 lg:h-14 max-w-full lg:max-w-[237px] items-center justify-center gap-2 rounded-lg bg-primary px-4 sm:px-6 lg:px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-2 focus-visible:ring-offset-2"
              >
                Share Your Knowledge
                <ArrowRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const { t } = useTranslation("common");
  const howItWorksCards = [
    {
      title: t("explore"),
      description: t("exploreDescription"),
      icon: exploreIcon,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: t("engageInTheCommunity"),
      description: t("engageInTheCommunityDescription"),
      icon: engageIcon,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: t("contributeAndGrow"),
      description: t("contributeAndGrowDescription"),
      icon: contributeIcon,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-10 max-w-[1400px] mx-auto mt-20 sm:py-14 lg:h-[914px] lg:max-h-[914px] bg-[#FBF5EA] rounded-2xl relative overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-8 sm:gap-10 lg:gap-14 px-4 sm:px-6 lg:px-20">
        {/* white rec - desktop layout unchanged */}
        <div className="absolute top-70 left-0 w-full h-full z-0 hidden lg:block">
          <Image
            src="/white-rec.jpg"
            alt=""
            width={400}
            height={409}
            className="h-[409px] object-cover"
          />
        </div>

        {/* dots - far right; smaller on mobile */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none hidden sm:block"
          aria-hidden
        >
          <Image
            src="/dots.svg"
            alt=""
            width={54}
            height={186}
            className="h-[100px] sm:h-[140px] lg:h-[186px] w-auto object-contain"
          />
        </div>

        {/* blue lines - hide on very small to avoid overlap */}
        <div
          className="absolute top-20 left-50 z-0 pointer-events-none hidden sm:block"
          aria-hidden
        >
          <Image
            src="/blue-lines.svg"
            alt=""
            width={100}
            height={100}
            className="h-[80px] sm:h-[100px] w-auto object-contain"
          />
        </div>

        {/* left column - second on mobile, first on desktop; phone smaller on mobile */}
        <div className="relative flex justify-center lg:justify-end order-2 lg:order-1 min-h-[280px] sm:min-h-[360px] lg:min-h-0">
          <Image
            src="/guono-phone.svg"
            alt="Guọnọ app on phone"
            width={540}
            height={600}
            className="h-[280px] sm:h-[380px] lg:h-[680px] z-10 translate-y-8 sm:translate-y-12 lg:translate-y-20 object-contain object-bottom"
          />
        </div>

        {/* Right - heading with yellow-circle on "World", then cards; first on mobile */}
        <div className="relative order-1 lg:order-2 flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <span className="text-xs sm:text-sm lg:text-[18px] font-medium uppercase tracking-widest text-foreground/80">
            {t("howItWorks")}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[44px] font-semibold text-foreground leading-tight max-w-xl">
            {t("everythingThat")}{" "}
            <span className="relative inline-block align-baseline text-[#0C96A5]">
              {t("drives")}
              <span
                className="absolute -left-1 -right-1 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none"
                aria-hidden
              >
                <Image
                  src="/yellow-circle.svg"
                  alt=""
                  width={179}
                  height={69}
                  className="w-[120%] min-w-[100px] h-auto object-contain opacity-90 -z-[1]"
                />
              </span>
            </span>{" "}
            {t("theUrhoboWorld")}.
          </h2>

          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 items-center">
            {howItWorksCards.map((card) => {
              return (
                <div
                  key={card.title}
                  className="flex gap-3 sm:gap-4 lg:gap-5 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-white border border-primary-2/10 w-full max-w-xl lg:max-w-none"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center ${card.iconBg} ${card.iconColor} shadow-sm [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6 lg:[&_svg]:w-7 lg:[&_svg]:h-7`}
                  >
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-foreground/70 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  // useInitTranslation();

  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <ClassesSection />
      <SupportSection />
      {/* <WorkWithPurposeSection /> */}
      <div className="mx-auto w-full py-10 sm:py-12 lg:py-24">
        <JoinTheUrhoboWorld />
      </div>
    </main>
  );
}
