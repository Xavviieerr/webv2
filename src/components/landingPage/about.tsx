"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { JoinTheUrhoboWorld } from "../newlayout/jointheurhoboWorld";
import { useRouter } from "next/navigation";


const AboutHeroSection = () => {
    return (
        <section className="relative min-h-0 flex items-center justify-center py-10 sm:py-16 lg:min-h-[70vh] lg:py-24 overflow-hidden">
            {/* Background pattern - about-back.svg */}
            <div
                className="absolute inset-0 z-0"
                aria-hidden
            >
                <Image
                    src="/about-back.svg"
                    alt=""
                    width={169}
                    height={180}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Floating leaf - smaller on mobile; desktop unchanged */}
            <div
                className="absolute left-0 bottom-0 z-10 w-[120px] h-[140px] sm:w-[150px] sm:h-[180px] lg:w-[169px] lg:h-[200px] pointer-events-none"
                aria-hidden
            >
                <Image
                    src="/guono-leaf.png"
                    alt=""
                    width={169}
                    height={200}
                    className="w-full h-full object-contain object-left-bottom"
                />
            </div>

            {/* Central content */}
            <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-center">
                <div className="mx-auto text-center flex flex-col items-center gap-4 sm:gap-6 lg:gap-8">
                    <span className="inline-flex items-center min-h-[44px] sm:min-h-[48px] lg:h-[51px] w-auto min-w-0 max-w-[205px] lg:w-[205px] justify-center rounded-lg border border-[#E5E5E5] bg-[#FBF5EA] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#1E4E42]">
                        ABOUT US
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#05353A] leading-tight">
                        The Urhobo Language
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-[24px] text-[#000000] leading-relaxed max-w-5xl px-1">
                        The Urhobo language is a beautiful, expressive, tonal language that, unfortunately, has
                        not been <span className="hidden sm:inline"> </span>
                        spoken officially in the Urhobo Nation for many years. Consequently, over time,
                        parts of the <span className="hidden sm:inline"> </span>
                        language have been forgotten, and sadly lost.
                    </p>
                </div>
            </div>
        </section>
    );
};


const missionGridImages = [
    { src: "/guono-mask.jpg", alt: "Community gathering" },
    { src: "/guono-about-2.jpg", alt: "Cultural event" },
    { src: "/guono-hero.png", alt: "Traditional attire" },
    { src: "/uhrobo-ppl.png", alt: "Urhobo culture illustration" },
    { src: "/guono-4.png", alt: "Community and culture" },
    { src: "/guono-5.jpg", alt: "Community and culture" },
];


const OurMissionSection = () => {
    return (
        <section className="relative min-h-0 py-10 sm:py-12 lg:min-h-[70vh] lg:py-16 overflow-hidden">

            <div
                className="absolute top-50 left-0 w-[180px] h-[90px] sm:w-[240px] sm:h-[110px] lg:w-[280px] lg:h-[120px] z-0 pointer-events-none hidden sm:block"
                aria-hidden
            >
                <Image
                    src="/longdots.svg"
                    alt=""
                    width={280}
                    height={120}
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 280px"
                    className="w-full h-full object-cover object-left-bottom"
                />
            </div>

            <div
                className="absolute bottom-0 left-0 w-[100px] h-[105px] sm:w-[120px] sm:h-[125px] lg:w-[133px] lg:h-[137px] z-10 pointer-events-none hidden sm:block"
                aria-hidden
            >
                <Image
                    src="/grey-squares.svg"
                    alt=""
                    width={133}
                    height={137}
                    className="w-full h-full object-contain object-left-bottom"
                />
            </div>

            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-20">

                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-8 sm:gap-10 lg:gap-14">
                    {/* Left column - first on mobile, left on desktop */}
                    <div className="relative z-10 order-1 lg:order-1 pt-6 sm:pt-8 sm:pl-8 lg:pl-12">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[44px] font-semibold text-[#111111] leading-tight mb-4 sm:mb-6">
                            Our Mission
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl lg:text-[24px] text-[#111111] leading-relaxed max-w-xl">
                            Guọnọ is a tech startup dedicated to providing
                            <br className="hidden sm:block" /> services in the Urhobo language. Our
                            goal is to help <br className="hidden sm:block" /> revive, promote, and document the Urhobo language.
                        </p>
                    </div>
                    {/* Right column - 2x3 image grid; second on mobile */}
                    <div className="grid grid-cols-3 grid-rows-2 gap-1 sm:gap-2 lg:gap-5 lg:w-[640px] order-2 lg:order-2 w-full min-w-0 self-stretch mx-auto lg:mx-0 min-h-[220px] sm:min-h-0">
                        {missionGridImages.map((img) => (
                            <div key={img.src} className="relative w-full min-w-0 aspect-square overflow-hidden rounded-sm">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    sizes="(max-width: 1024px) 33vw, 200px"
                                    className="object-cover rounded-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

    );
}


const OurVisionSection = () => {
    return (
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 relative lg:py-16">
            {/* Right - illustration */}

            <div className="rounded-2xl lg:rounded-[60px] max-w-[1400px] lg:py-18 lg:px-16 mx-auto relative bg-[#F1F9FE] overflow-hidden px-6 sm:px-8 py-8 sm:py-10 ">
                <div className="absolute hidden md:block bottom-0 right-0 w-[510px] h-[500px]">
                    <Image
                        src="/guono-illustration.png"
                        alt="Illustration — Urhobo "
                        width={510}
                        height={500}
                        className="w-full h-full object-fit object-fit"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                    {/* Left - text (first on mobile, left on desktop) */}
                    <div className="order-1 flex flex-col gap-4 sm:gap-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-semibold text-[#00373E] leading-tight">
                            Our Vision
                        </h2>
                        <div className="flex flex-col gap-4 text-[#00373E] text-left">
                            <p className="text-base sm:text-lg lg:text-[24px] leading-relaxed">
                                We will continue researching and adding new words and information about the Urhobo language and culture as we grow.
                                We hope our services will help learners worldwide and in the Urhobo Nation who are passionate about the Urhobo language and culture learn more easily
                            </p>
                            <p className="text-base sm:text-lg lg:text-[24px] leading-relaxed">
                                Additionally, we hope that those in the Urhobo community who are already fluent in
                                the Urhobo language and dedicated to the Urhobo world will share their wealth of
                                knowledge and culture more meaningfully.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


const OurFutureSection = () => {
    const router = useRouter();
    const handleGetStarted = () => {
        router.push("/signup");
    }
    return (
        <section className="py-10 sm:py-14 lg:py-20 overflow-hidden">
            <div className="relative lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                    {/* Left on desktop - illustration; second on mobile */}
                    <div className="relative col-span-2 order-1 flex justify-center items-center overflow-hidden py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 min-h-[260px] sm:min-h-[300px] lg:min-h-0">
                        <Image
                            src="/guono-ppl-big.jpg"
                            alt="Community — Urhobo language and culture"
                            width={800}
                            height={608}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    {/* Right on desktop - text and button; first on mobile */}
                    <div className="col-span-3 order-1 lg:order-2 bg-[#FBEDCA] flex w-full items-center">
                        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 max-w-5xl px-6 sm:px-8 lg:px-24 py-8 sm:py-10 lg:py-14 w-full">
                            <div className="flex flex-col items-start gap-0.5">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[32px] font-semibold text-[#050706] leading-tight uppercase tracking-tight">
                                    Our Future
                                </h2>
                                <span className="w-10 sm:w-16 h-2 bg-[#23D8EC]" aria-hidden />
                            </div>
                            <p className="text-base sm:text-lg lg:text-[20px] max-w-xl leading-relaxed font-normal">
                                We are confident that one day in the near future, Urhobo will become the official language
                                of the Urhobo Nation, taught in schools and spoken in Urhobo communities with pride and
                                love. Together, we can create the Urhobo world.
                            </p>

                            <Button
                                className="w-full sm:w-auto inline-flex h-12 sm:h-[58px] lg:w-[237px] items-center 
                            justify-center rounded-lg bg-primary px-6 sm:px-8 text-sm font-medium
                             text-primary-foreground transition-colors cursor-pointer
                             hover:bg-primary/90 focus-visible:outline-none
                              focus-visible:ring-2 focus-visible:ring-primary-2 focus-visible:ring-offset-2"
                              onClick={handleGetStarted}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function About() {
    return (
        <main>
            <AboutHeroSection />
            <OurMissionSection />
            <OurVisionSection />
            <OurFutureSection />
            <div className="mx-auto w-full py-10 sm:py-12 lg:py-16">    
                <JoinTheUrhoboWorld />
            </div>
        </main>
    );
}
