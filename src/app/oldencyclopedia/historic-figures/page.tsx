"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/layouts/Footer";

import { useRouter } from "next/navigation";


interface HistoricalItem {
    id: number;
    title: string;
    meaning: string;
    description: string;
}

type GroupedHistory = Record<string, HistoricalItem[]>;

const HistoricalFeatures = () => {
    const router = useRouter();

    const history = [
        {
            id: 1,
            title: "Efe",
            meaning: "Joy",
            description: "Efe represents happiness and joy in Urhobo culture.",
        },
        {
            id: 2,
            title: "Ese",
            meaning: "Grace",
            description: "Ese symbolizes divine grace and blessing.",
        },
        {
            id: 3,
            title: "Igho",
            meaning: "Wealth",
            description: "Igho historically represents wealth and prosperity.",
        },
        {
            id: 4,
            title: "Oghene",
            meaning: "God",
            description: "Oghene is the supreme God in Urhobo belief.",
        },
    ];

    // ✅ Group history by first letter (same as Names)
    const groupedHistory = history.reduce<GroupedHistory>((acc, item) => {
        const letter = item.title.charAt(0).toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(item);
        return acc;
    }, {});


    const goToHistory = (id: number) => {
        router.push(`/history/${id}`);
    };

    return (
        <main className="max-w-7xl text-black mx-auto w-full px-4">
            {/* Logo */}
            <div className="flex items-center justify-center h-[91px] py-6">
                <Link href="/">
                    <Image
                        src="/guono-logo.svg"
                        alt="guọnọ logo"
                        width={100}
                        height={30}
                        priority
                    />
                </Link>
            </div>

            <SearchBar />

            {/* Intro */}
            <div className="text-center mb-10">
                <h2 className="text-3xl mt-8 mb-2 font-semibold">
                    Historical Figures
                </h2>
                <p className="text-gray-600">
                    Discover Urhobo historical figures
                </p>
            </div>

            {/* Alphabet Nav */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 mb-10">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                    <a
                        key={letter}
                        href={`#letter-${letter}`}
                        className="text-sm font-medium text-[#053B3A] hover:underline"
                    >
                        {letter}
                    </a>
                ))}
            </div>

            {/* Grouped History Sections */}
            {Object.keys(groupedHistory)
                .sort()
                .map((letter) => (
                    <section
                        key={letter}
                        id={`letter-${letter}`}
                        className="mb-12 border-b border-gray-300 pb-10"
                    >
                        {/* Letter Header */}
                        <h3 className="text-3xl font-bold text-[#053B3A] mb-6">
                            {letter}
                        </h3>

                        {/* History Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedHistory[letter].map((item: HistoricalItem) => (
                                <div
                                    key={item.id}
                                    onClick={() => goToHistory(item.id)}
                                    className="bg-[rgba(138,165,168,0.1)] cursor-pointer py-8 relative flex border-l-4 border-[rgba(138,165,168,1)] rounded-xl p-5 shadow-sm hover:shadow-md transition"
                                >
                                    <div>
                                        <h4 className="text-xl font-bold text-[#053B3A]">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Meaning: {item.meaning}
                                        </p>
                                        <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

            <Footer />
        </main>
    );
};

export default HistoricalFeatures;
