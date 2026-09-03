
"use client";

import React, { useState } from "react";

import Footer from "@/components/layouts/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import ModalWrapper from "@/components/ModalWrapper";

interface DictionaryWord {
    id: number;
    word: string;
    meaning: string;
    translation: string;
    definition: string;
    totalComment: number;
    totalVote: number;
    tweets: number;
}


const Urhobo_dictionary = () => {

    const words = [
        {
            id: 1,
            word: "Oghene",
            meaning: "God",
            translation: "God",
            definition: "Oghene means God in the Urhobo language.",
            totalComment: 12,
            totalVote: 45,
            tweets: 23,
        },
        {
            id: 2,
            word: "Uvie",
            meaning: "King",
            translation: "King",
            definition: "Uvie refers to a traditional king or ruler in Urhobo land.",
            totalComment: 8,
            totalVote: 31,
            tweets: 14,
        },
        {
            id: 3,
            word: "Ejiro",
            meaning: "Praise",
            translation: "Praise",
            definition: "Ejiro means praise or thanksgiving.",
            totalComment: 5,
            totalVote: 22,
            tweets: 9,
        },
        {
            id: 4,
            word: "Omamri",
            meaning: "Festival",
            translation: "Festival",
            definition: "Omamri refers to a traditional Urhobo festival or celebration.",
            totalComment: 6,
            totalVote: 18,
            tweets: 11,
        },
        {
            id: 5,
            word: "Igho",
            meaning: "Money",
            translation: "Money",
            definition: "Igho means money or wealth.",
            totalComment: 15,
            totalVote: 50,
            tweets: 27,
        },
        {
            id: 6,
            word: "Efe",
            meaning: "Joy",
            translation: "Joy",
            definition: "Efe means joy or happiness.",
            totalComment: 4,
            totalVote: 16,
            tweets: 6,
        },
        {
            id: 7,
            word: "Orerokpe",
            meaning: "Market town",
            translation: "Market town",
            definition: "Orerokpe is commonly associated with a central market town.",
            totalComment: 7,
            totalVote: 20,
            tweets: 10,
        },
    ];


    const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);

   const openModal = (word: DictionaryWord) => {
    setSelectedWord(word);
    setIsModalOpen(true);
};


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedWord(null);
    };

    return (
        <header className="max-w-7xl text-black mx-auto w-full px-4">
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

            {/* Intro */}
            <div className="text-black text-center mb-10">
                <h2 className="text-3xl font-semibold mt-8 mb-2">Urhobo Dictionary</h2>
                <p className="text-gray-600 mb-4">
                    Urhobo new words. Share your thoughts below.
                </p>

                <button className="bg-[#053B3A] rounded-full text-white px-6 py-4 px-3 font-medium hover:opacity-90 transition">
                    Explore Dictionary
                </button>

                <p className="mt-3 text-sm text-gray-500">
                    Total Names: 3,201
                </p>
            </div>

            {/* Recently Added Words */}
            <section>
                <h3 className="text-2xl text-[#05353aff] font flex item-center justify-center font-semibold mb-2">Recently Added Words</h3>
                <p className="text-[#000000ff] text-center mb-6">
                    Vote and comment on newly added words to help Revive the Urhobo language.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {words.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => openModal(item)}
                            className="bg-white cursor-pointer gap-5 relative item-center flex border-l-2 border-gray-600 rounded-xl p-5 shadow-sm hover:shadow-md h-36 transition"
                        >

                            {/* <div className="absolute -left-1 bg-[#8aa5a8]  h-[95%] w-1.5 rounded-l-xl top-1"></div> */}
                            <div className="flex flex-col gap-3 mt-2 text-black ">
                                <FaChevronUp />
                                <span className="text-black"> {item.totalVote}</span>
                                <FaChevronDown />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-[#053B3A]">
                                    {item.word}
                                </h4>

                                <p className="text-sm text-gray-500 mb-2">
                                    Translation: <span className="font-medium">{item.meaning}</span>
                                </p>

                                <p className="text-gray-700 text-sm">
                                    {item.definition}
                                </p>

                                <div className="flex items-center  mt-2 text- font-semibold text-gray-500">
                                    <GoComment className="mr-1 text-lg" />
                                    <span className="text-sm"> {item.totalComment} comments</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="underline w-full my-18 text-center pb-[2px]">See More</p>
                <div className="text-black  mb-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold mt-8 mb-2">Recently Coined Words</h2>
                        <p className="text-gray-600 mb-4">
                            Vote and comment on newly added words to help improve our dictionary                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {words.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white gap-5 relative item-center  flex  border-l-2 border-gray-600 rounded-xl p-5 shadow-sm hover:shadow-md h-36 transition"
                            >
                                {/* <div className="absolute -left-1 bg-[#8aa5a8]  h-[95%] w-1.5 rounded-l-xl top-1"></div> */}
                                <div className="flex flex-col gap-3 mt-2 text-black ">
                                    <FaChevronUp />
                                    <span className="text-black"> {item.totalVote}</span>
                                    <FaChevronDown />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[#053B3A]">
                                        {item.word}
                                    </h4>

                                    <p className="text-sm text-gray-500 mb-2">
                                        Translation: <span className="font-medium">{item.meaning}</span>
                                    </p>

                                    <p className="text-gray-700 text-sm">
                                        {item.definition}
                                    </p>

                                    <div className="flex items-center  mt-2 text- font-semibold text-gray-500">
                                        <GoComment className="mr-1 text-lg" />
                                        <span className="text-sm"> {item.totalComment} comments</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="underline w-full my-18 text-center pb-[2px]">See More</p>

                </div>
            </section>

            <ModalWrapper isOpen={isModalOpen} onClose={closeModal}>
                {selectedWord && (
                    <div className="text-center">
                        {/* Image */}
                        <div className="w-full mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Image
                                src="/images/word-placeholder.png" // replace later with dynamic image
                                alt={selectedWord.word}
                                width={400}
                                height={400}
                            />
                        </div>
                        <div className="flex justify-between w-full items-center">
                            {/* Word */}
                            <h2 className="text-2xl font-bold text-[#053B3A]">
                                {selectedWord.word}
                            </h2>
                            <Image
                                src="/images/share.png" // replace later with dynamic image
                                alt={selectedWord.word}
                                width={20}
                                height={20}
                            />
                        </div>

                        {/* Translation */}
                        {/* <p className="text-gray-500 mt-1">
                            Meaning: <span className="font-medium">{selectedWord.meaning}</span>
                        </p> */}

                        {/* Definition */}
                        <p className="text-gray-700 text-left text-sm mt-4">
                            {selectedWord.definition}
                        </p>

                        {/* Meta */}
                        {/* <div className="flex justify-center gap-6 mt-5 text-sm text-gray-500">
                            <span>👍 {selectedWord.totalVote} votes</span>
                            <span>💬 {selectedWord.totalComment} comments</span>
                        </div> */}

                        {/* Close */}
                        {/* <button
                            onClick={closeModal}
                            className="mt-6 bg-[#053B3A] text-white px-6 py-2 rounded-full hover:opacity-90"
                        >
                            Close
                        </button> */}
                    </div>
                )}
            </ModalWrapper>

            <Footer />

        </header>
    );
};

export default Urhobo_dictionary;
