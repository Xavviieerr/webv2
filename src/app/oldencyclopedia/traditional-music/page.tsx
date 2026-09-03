"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Music = {
    image: string
    title: string
    artist: string
}

const demoMusics: Music[] = [
    { image: '/images/music1.png', title: 'Oghene Me', artist: 'Agofure Onojaefe' },
    { image: '/images/music2.png', title: 'Erivwin R’Oghene', artist: 'Traditional Choir' },
    { image: '/images/music3.png', title: 'Uvwie R’Oshare', artist: 'Cultural Ensemble' },
    { image: '/images/music1.png', title: 'Igho R’Urhobo', artist: 'Cultural Ensemble' },
]

// 🔤 Group music A–Z
const groupByAlphabet = (musics: Music[]) => {
    return musics
        .sort((a, b) => a.title.localeCompare(b.title))
        .reduce((acc: Record<string, Music[]>, music) => {
            const letter = music.title.charAt(0).toUpperCase()
            if (!acc[letter]) acc[letter] = []
            acc[letter].push(music)
            return acc
        }, {})
}


const slugify = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

const TraditionalMusic = () => {
    const groupedMusic = groupByAlphabet(demoMusics)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    return (
        <main className="max-w-7xl mx-auto w-full px-4 text-black">
            {/* Logo */}
            <div className="flex items-center justify-center h-[91px] py-6">
                <Link href="/">
                    <Image src="/guono-logo.svg" alt="guọnọ logo" width={100} height={30} priority />
                </Link>
            </div>

            {/* <SearchBar /> */}

            {/* Intro */}
            <div className="text-center pb-8">
                <h2 className="text-3xl font-semibold mt-8 mb-2"> Music</h2>
                <p className="text-gray-700">Discover Urhobo music and lyrics</p>
            </div>

            {/* Alphabet Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {alphabet.map((letter) => (
                    <a
                        key={letter}
                        href={`#letter-${letter}`}
                        className={`text-sm font-medium ${groupedMusic[letter]
                            ? 'text-[#053B3A] hover:underline'
                            : 'text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {letter}
                    </a>
                ))}
            </div>

            {/* Alphabet Sections */}
            {alphabet.map(
                (letter) =>
                    groupedMusic[letter] && (
                        <section key={letter} id={`letter-${letter}`} className="mb-12">
                            <h3 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-1">
                                {letter}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {groupedMusic[letter].map((music, index) => (
                                    <Link
                                        href={`/encyclopedia/traditional-music/${slugify(music.title)}`}
                                        key={index}
                                        className="bg-gray-100 rounded-xl p-4 hover:shadow-md transition block"
                                    >
                                        <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
                                            <Image
                                                src={music.image}
                                                alt={music.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className='bg-[rgba(138, 165, 168, 0.1)] '>

                                            <h4 className="font-semibold">{music.title}</h4>
                                            <p className="text-sm text-gray-600">{music.artist}</p>

                                            <span className="mt-2 inline-flex items-center gap-1 text-sm text-[#053B3A] hover:underline group">
                                                View Lyrics
                                                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 animate-arrow">
                                                    →
                                                </span>
                                            </span>

                                        </div>
                                    </Link>

                                ))}
                            </div>
                        </section>
                    )
            )}
        </main>
    )
}

export default TraditionalMusic
