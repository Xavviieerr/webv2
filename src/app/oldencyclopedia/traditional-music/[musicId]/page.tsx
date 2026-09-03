import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Music = {
    image: string
    title: string
    artist: string
    id: string
    lyrics: string
}


const demoMusics: Music[] = [
    {
        id: 'oghene-me',
        image: '/images/music1.png',
        title: 'Oghene Me',
        artist: 'Agofure Onojaefe',
        lyrics: `
E! A!
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Ofresh O!
Ololo

E! Ẹhẹn
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Lelele

E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she

Mi ni
E je ayen she
E je ayen she
E!

Ituru ne guọnọ mi ri ghwu
Je ayen she
(Shekiri jedo)

Ituru ne guọnọ mi ri she
Je ayen she
(Shekiri jedo)

Ituru mu kpahọ vwẹ
Je ayen she
(Shekiri jedo)

Ọ ro vwori biko
Je ayen she
Lẹlẹlẹ
`
    },
    {
        id: 'erivwin-roghene',
        image: '/images/music2.png',
        title: 'Erivwin R’Oghene',
        artist: 'Traditional Choir',
        lyrics: `
E! A!
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Ofresh O!
Ololo

E! Ẹhẹn
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Lelele

E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she

Mi ni
E je ayen she
E je ayen she
E!

Ituru ne guọnọ mi ri ghwu
Je ayen she
(Shekiri jedo)

Ituru ne guọnọ mi ri she
Je ayen she
(Shekiri jedo)

Ituru mu kpahọ vwẹ
Je ayen she
(Shekiri jedo)

Ọ ro vwori biko
Je ayen she
Lẹlẹlẹ
`
    },
    {
        id: 'uvwie-roshare',
        image: '/images/music3.png',
        title: 'Uvwie R’Oshare',
        artist: 'Cultural Ensemble',
        lyrics: `
E! A!
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Ofresh O!
Ololo

E! Ẹhẹn
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Lelele

E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she

Mi ni
E je ayen she
E je ayen she
E!

Ituru ne guọnọ mi ri ghwu
Je ayen she
(Shekiri jedo)

Ituru ne guọnọ mi ri she
Je ayen she
(Shekiri jedo)

Ituru mu kpahọ vwẹ
Je ayen she
(Shekiri jedo)

Ọ ro vwori biko
Je ayen she
Lẹlẹlẹ
`
    },
    {
        id: 'igho-rurhobo',
        image: '/images/music1.png',
        title: 'Igho R’Urhobo',
        artist: 'Cultural Ensemble',
        lyrics: `
E! A!
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Ofresh O!
Ololo

E! Ẹhẹn
Ọ ro vwo yẹ (Ẹhẹn)
E! Ọhwẹ
Lelele

E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she
E je ayen she

Mi ni
E je ayen she
E je ayen she
E!

Ituru ne guọnọ mi ri ghwu
Je ayen she
(Shekiri jedo)

Ituru ne guọnọ mi ri she
Je ayen she
(Shekiri jedo)

Ituru mu kpahọ vwẹ
Je ayen she
(Shekiri jedo)

Ọ ro vwori biko
Je ayen she
Lẹlẹlẹ
`
    },
]


const EachMusic = async ({ params }: { params: Promise<{ musicId: string }> }) => {
  const { musicId } = await params;

  const music = demoMusics.find((m) => m.id === musicId);

  if (!music) {
    return <p className="p-10">Music not found</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-black">
      <Link
        href="/encyclopedia/traditional-music"
        className="text-sm text-[#053B3A] hover:underline"
      >
        ← Back to Music
      </Link>

      <div className="mt-6 flex flex-col justify-center md:flex-row gap-6">
        <div className="relative flex justify-center w-full md:w-1/2 h-52 rounded-xl overflow-hidden">
          <Image
            src={music.image}
            alt={music.title}
            width={100}
            height={100}
            className="object-cover rounded-2xl w-[40%]"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl text-center font-bold">{music.title}</h1>
          <p className="mt-2 text-gray-600 text-center">{music.artist}</p>

          <div className="mt-8 text-center">
            <h3 className="font-semibold mb-3 text-lg">Lyrics</h3>
            <pre className="whitespace-pre-line text-sm leading-7 text-gray-800 font-serif">
              {music.lyrics}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EachMusic;

