"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/types/hooks";
import { useTranslation } from "react-i18next";
import { 
    IconBook, 
    IconUsers, 
    IconStar, 
    IconMapPin, 
    IconFileText, 
    IconMusic,
    IconChevronRight
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useWordOfDayQuery } from "@/slice/endpoints";
import { useWordCountTotalQuery } from "@/slice/wordEndpoints";

export const WelcomeBanner = () => {
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const userFirstName = user?.firstName ?? "there";
    const { t } = useTranslation("common");
    return (
        <div className="w-full rounded-2xl bg-[#D4E8EA] p-6 sm:p-8 lg:p-10 overflow-hidden relative">
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-auto h-full items-center justify-end" >
                <div className="relative h-full w-[400px] lg:w-[450px] xl:w-[500px]">
                    <Image 
                        src="/illustration-2.svg" 
                        alt="Welcome Banner Background" 
                        fill
                        className="object-contain object-right" 
                    />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 relative z-10">
                {/* Left Section - Text Content */}
                <div className="flex-1 flex flex-col gap-4 sm:gap-5">
                    <h1 className="text-[24px] sm:text-2xl lg:text-[24px] capitalize font-medium text-[#111111]">
                        {userFirstName} 👋🏽
                    </h1>
                    <div className="flex flex-col gap-1 sm:gap-2">
                        <h2 className="text-[28px] font-semibold text-[#291E0A]">
                            Welcome back,
                        </h2>
                    </div>
                    <p className="text-sm sm:text-base lg:text-[16px] text-[#11111] font-normal leading-relaxed max-w-lg">
                        Continue learning, exploring, and building the Urhobo world.
                    </p>
                    <Button
                    onClick={() => {
                        router.push("/search");
                    }}
                        className="inline-flex items-center px-4 py-6 justify-center min-w-[200px] min-h-[52px] rounded-lg bg-[#1A4349] 
                        text-white font-medium uppercase text-sm sm:text-base hover:bg-[#1A4349]/90 transition-colors w-fit mt-2"
                    >
                        {t("guonoSearch")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const QuickAccess = () => {
    const router = useRouter();
    const { data: wordCountData } = useWordCountTotalQuery();
    const dictionaryEntryCount =
        wordCountData?.data != null
            ? `${Number(wordCountData.data).toLocaleString()} entries`
            : "— entries";

    const quickAccessItems = [
        {
            title: "Urhobo Dictionary",
            description: "Comprehensive collection of Urhobo words and their meanings",
            count: dictionaryEntryCount,
            icon: IconBook,
            iconBg: "#59431B",
            href: "/dashboard/dictionary",
            isReady: true,
        },
        {
            title: "Urhobo Names",
            description: "These are list of names and meaning",
            count: "500+ Names",
            icon: IconUsers,
            iconBg: "#4880FF",
            // href: "/dashboard/names"
            isReady: false,
        },
        {
            title: "Cultural Practices",
            description: "Traditional ceremonies, rituals, and customs",
            count: "80+ practices",
            icon: IconUsers,
            iconBg: "#FF9448",
            // href: "/dashboard/cultural-practices"
            isReady: false,
        },
        {
            title: "Historical Features",
            description: "Notable Urhobo leaders and influencers",
            count: "60+ profiles",
            icon: IconStar,
            iconBg: "#0D4D4D",
            // href: "/dashboard/historical"
            isReady: false,
        },
        {
            title: "Places",
            description: "All the significant Urhobo locations",
            count: "120+ locations",
            icon: IconMapPin,
            iconBg: "#5BC17F",
            // href: "/dashboard/places"
            isReady: false,
        },
        {
            title: "Proverbs & Idioms",
            description: "Wisdom passed through generations",
            count: "300+ sayings",
            icon: IconFileText,
            iconBg: "#48CBFF",
            // href: "/dashboard/proverbs"
            isReady: false,
        },
        {
            title: "Urhobo Music",
            description: "Instruments, rhythms, and compositions",
            count: "40+ recordings",
            icon: IconMusic,
            iconBg: "#241624",
            // href: "/dashboard/music"
            isReady: false,
        },
        {
            title: "Folktales",
            description: "Moral stories and ancestral wisdom",
            count: "120+ stories",
            icon: IconBook,
            iconBg: "#9748FF",
            // href: "/dashboard/folktales"
            isReady: false,
        }
    ];
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {quickAccessItems.map((item, index) => {
                    const IconComponent = item.icon;
                    if (!item.isReady) {
                        return null;
                    }
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                if (item.href) {
                                    router.push(item.href);
                                }
                            }}
                            className="group bg-[#D4E8EA] rounded-xl p-5 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-100"
                        >
                            <div className="flex flex-col gap-4">
                                {/* Icon */}
                                <div 
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: item.iconBg }}
                                >
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-2 flex-1">
                                    <h3 className="text-lg font-medium text-[#0D4D4D] group-hover:text-[#1A4349] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Footer with count and arrow */}
                                <div className="flex items-center justify-between mt-auto pt-2">
                                    <span className="text-xs text-gray-500">
                                        {item.count}
                                    </span>
                                    <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const FEATURED_CARD_BG = "#0A3D3DCC";
const FEATURED_SECTION_BG = "#05353A";

const FeaturedContent = () => {
    const { t } = useTranslation("common");
    const { data: wordOfDayData, isLoading: wordOfDayLoading } = useWordOfDayQuery();

    return (
        <div
            className="w-full rounded-2xl p-5 sm:p-6 lg:p-8 overflow-hidden relative"
            style={{ backgroundColor: FEATURED_SECTION_BG }}
        >
            <h2 className="text-[24px] font-mediu text-white mb-5 sm:mb-6">
                {t("featuredContent")}
            </h2>

            {/* Floating pie graphic - bottom-right, partially clipped by card */}
            <div
                className="absolute -bottom-6 -right-6 w-full lg:w-[300px] h-[290px] pointer-events-none opacity-80"
                aria-hidden
            >
                <Image
                    src="/featured-pie.svg"
                    alt=""
                    width={285}
                    height={290}
                    className="object-cover w-full h-full "
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Word of the Day - populated from API */}
                <div
                    className="relative rounded-xl p-5 sm:p-6 flex flex-col min-h-[200px] overflow-hidden"
                    style={{ backgroundColor: FEATURED_CARD_BG }}
                >
                    <span className="text-[14px] sm:text-sm font-medium text-white/90 uppercase tracking-wide">
                        {t("wordOfTheDay")}
                    </span>
                    {wordOfDayLoading ? (
                        <div className="mt-2 flex-1 flex items-center">
                            <span className="text-white/70 text-sm">Loading…</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-[24px] font-semibold text-white mt-2">
                                {wordOfDayData?.word ?? "—"}
                            </h3>
                                <p className="text-sm text-white/90 font-medium leading-relaxed mt-2 flex-1">
                                {wordOfDayData?.meaning ?? ""}
                            </p>
                        </>
                    )}
                </div>

                {/* Cultural Highlight */}
                <div
                    className="relative rounded-xl p-5 sm:p-6 flex flex-col min-h-[200px] overflow-hidden"
                    style={{ backgroundColor: FEATURED_CARD_BG }}
                >
                    <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wide">
                        {t("culturalHighlight")}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                        Igbe Ikeneke
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed mt-2 flex-1 pr-4 sm:pr-6">
                        <span className="block">{t("featuredPhrase2a")}</span>
                        <span className="block mt-1">{t("featuredPhrase2b")}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

interface  PostToCommunityProps {
    isVisible?: boolean;
}

const PostToCommunity = (props: PostToCommunityProps) => {
    const { isVisible = true } = props;
    if (!isVisible) {
        return null;
    }
    return (
        <button
            type="button"
            className="relative w-full lg:min-w-[280px] lg:max-w-[316px] h-[316px]  rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md hover:opacity-95 transition-all"
            aria-label="Post to Community"
        >
            <Image
                src="/Banner.png"
                alt="Post to Community"
                width={260}
                height={260}
                className="object-cover object-center mx-auto"
            />
        </button>
    );
};

export const DashboardComponents = () => {
    return (
        <>
            <WelcomeBanner />
            <QuickAccess />
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                <FeaturedContent/>  
                <PostToCommunity isVisible={false} />
            </div>
        </>
    )
}