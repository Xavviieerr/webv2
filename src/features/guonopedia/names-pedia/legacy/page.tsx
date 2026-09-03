
"use client";

import React, {  useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layouts/Footer";
import SearchBar from "@/components/SearchBar";
import ModalWrapper from "@/components/ModalWrapper";



interface NameItem {
  id: number;
  word: string;
  meaning: string;
  definition: string;
  totalVote: number;
  totalComment: number;
}

type GroupedNames = Record<string, NameItem[]>;

const Names:React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedName, setSelectedName] = useState<NameItem | null>(null);

  const openModal = (item: NameItem) => {
    setSelectedName(item);
    setIsModalOpen(true);
};


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedName(null);
    };

    const names: NameItem[] = [
        {
            id: 1,
            word: "Efe",
            meaning: "Joy",
            definition: "Efe means joy or happiness.",
            totalVote: 24,
            totalComment: 6,
        },
        {
            id: 2,
            word: "Ese",
            meaning: "Grace",
            definition: "Ese means grace or blessing.",
            totalVote: 18,
            totalComment: 4,
        },
        {
            id: 3,
            word: "Igho",
            meaning: "Wealth",
            definition: "Igho means money or wealth.",
            totalVote: 42,
            totalComment: 12,
        },
        {
            id: 4,
            word: "Oghene",
            meaning: "God",
            definition: "Oghene means God.",
            totalVote: 55,
            totalComment: 20,
        },
    ];


  const groupedNames = names.reduce<GroupedNames>((acc, item) => {
  const letter = item.word.charAt(0).toUpperCase();
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(item);
  return acc;
}, {});


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
            <div className="text-black text-center mb-10">
                <h2 className="text-3xl font- mt-8 mb-2">Urhobo Names</h2>
                <p className="text-gray-900 mb-2">
                    Discover Urhobo names and their meanings
                </p>

                <p className="mt-3 text-sm text-gray-500">
                    Total Names: 3,201
                </p>
            </div>

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

            {Object.keys(groupedNames)
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

                        {/* Names Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{groupedNames[letter].map((item: NameItem) => (
                                <div
                                    key={item.id}
                                    onClick={() => openModal(item)}
                                    className="bg-[rgba(138,165,168,0.1)] cursor-pointer gap-8 py-8 relative flex border-l-4 border-[rgba(138,165,168,1)] rounded-xl p-5 shadow-sm hover:shadow-md transition"
                                >
                                    <div>
                                        <h4 className="text-xl font-bold text-[#053B3A]">
                                            {item.word}
                                        </h4>
                                        <p className="text-gray-700 text-sm">
                                            {item.definition}
                                        </p>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </section>
                ))}

            {/* Recently Added Words */}


            <ModalWrapper isOpen={isModalOpen} onClose={closeModal}>
                {selectedName && (
                    <div className="space-y-4 border-black/20 ">
                        <div className="flex  items-center justify-center gap-8">

                            <h2 className="text-2xl font-bold text-[#053B3A]">
                                {selectedName.word}
                            </h2>
                            <Image
                                alt=""
                                className="mt-1"
                                src='/icons/speaker.svg'
                                width={20}
                                height={20}
                            >

                            </Image>
                        </div>

                        <p className="text-sm text-gray-500">
                            Meaning:{" "}
                            <span className="font-medium text-gray-800">
                                {selectedName.meaning}
                            </span>
                        </p>

                        <p className="text-gray-700">
                            {selectedName.definition}
                        </p>

                        <p>Akpọ - arhọ ohwo vwo - life/world
                            Mẹ - emu obọ - Mine</p>

                    </div>
                )}
            </ModalWrapper>


            <Footer />

        </main>
    )
}
export default Names