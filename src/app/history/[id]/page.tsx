'use client';

import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import Image from 'next/image';
import React from 'react';

const SingleHistory = () => {
    return (
        <main className="max-w-4xl mx-auto px-4 text-gray-800 leading-relaxed">
            <Header />

            {/* Title */}

            <div className='flex flex-col justify-center items-center'>

                <Image
                    src='/images/history-image.png'
                    alt='history'
                    height={150}
                    width={200}

                />
                <h1 className="text-3xl font-bold text-[#053B3A] mt-2 ">
                    Agofure
                </h1>
                <h1 className="text-lg font-semibold text-[#053B3A] mb-4 ">
                    Musician
                </h1>
            </div>

            {/* Intro */}
            <p className="mb-6">
                <strong>Agofure Onojaefe</strong> (born March 15, 1998) is a Nigerian singer,
                songwriter, and producer who has emerged as one of the most compelling
                voices in contemporary African music. Known for her powerful vocals,
                genre-defying sound, and socially conscious lyrics, Agofure has gained
                international recognition and a devoted global fanbase.
            </p>

            <p className="mb-6">
                Her music blends Afrobeat, R&B, soul, and pop, creating a distinctive
                sound that reflects both her Nigerian heritage and global influences.
                Since her breakthrough in 2023, she has accumulated over 50 million
                streams across digital platforms and received multiple awards and
                nominations.
            </p>

            {/* Early Life */}
            <h2 className="text-2xl font-semibold text-[#053B3A] mt-10 mb-4">
                Early Life and Background
            </h2>

            <p className="mb-6">
                Agofure was born in the bustling Surulere district of Lagos, Nigeria, into
                a family deeply rooted in music and academia. Her father, Dr. Emmanuel
                Onojaefe, was a professor of musicology at the University of Lagos, while
                her mother, Grace Onojaefe, was a renowned gospel singer in local churches
                throughout the 1990s.
            </p>

            <p className="mb-6">
                Growing up in a household where traditional Nigerian folk music coexisted
                with contemporary gospel and American soul records, Agofure developed an
                eclectic musical taste from an early age.
            </p>
            <p className="mb-6">
                As a child, she showed exceptional musical talent, learning to play the piano at age five and
                joining her mother&rsquo;s church choir by age seven. She attended Corona School in Lagos for her
                primary education, where she participated in numerous talent shows and musical performances.
                Her secondary education took place at Queens College, Lagos, one of Nigeria&rsquo;s premier secondary s
                chools, where she served as the head of the music society and organized several successful musical productions.
            </p>
            <p className="mb-6">
                Despite her obvious musical gifts, Agofure initially pursued a degree in Mass Communication at
                the University of Lagos, following her parent&rsquo;s wishes for her to have a &quot;stable career path.&quot; However, it was
                during her university years that she began writing her own songs and performing at campus events, eventually
                deciding to fully commit to her musical aspirations in her final year.
            </p>

            {/* Education */}
            <h2 className="text-2xl font-semibold text-[#053B3A] mt-10 mb-4">
                Family and Personal Life
            </h2>

            <p className="mb-6">
                Agofure comes from a close-knit family of five children, where she is the third child. Her older
                brother, Akpofure Onojaefe, is a successful software engineer based in London, while her older sister,
                Ufuoma, works as a physician in Abuja.
                Her younger siblings, twins Ovie and Oghene, are currently pursuing their undergraduate studies.
            </p>
            <p className="mb-6">
                Her maternal grandmother, with whom she was particularly close, was a traditional
                storyteller from Delta State, Nigeria. Agofure credits her grandmother&rsquo;s vivid storytelling
                and understanding of Urhobo folklore as major influences on her songwriting approach,
                particularly in how she structures narratives within her music.
            </p>
            <p className="mb-6">
                Currently based in Lagos with a second residence in London, Agofure is known for maintaining a relatively
                private personal life despite her growing fame. She is an advocate for mental health awareness
                and women&rsquo;s education in Africa, regularly partnering with NGOs to
                support underprivileged girl&rsquo;s access to education.
            </p>

            {/* Cultural Influence */}
            <h2 className="text-2xl font-semibold text-[#053B3A] mt-10 mb-4">
                Early Career (2018-2022)
            </h2>
            <h2 className="text-2xl font-semibold text-[#053B3A] mt-10 mb-4">
                Cultural Influence
            </h2>

            <p className="mb-6">
                Agofure credits her maternal grandmother, a traditional storyteller from
                Delta State, as a major influence on her songwriting. Her grandmother’s
                knowledge of Urhobo folklore and vivid storytelling helped shape Agofure’s
                narrative-driven musical style.
            </p>

            {/* Career */}
            <h2 className="text-2xl font-semibold text-[#053B3A] mt-10 mb-4">
                Career
            </h2>

            <p className="mb-6">
                Agofure’s professional music journey began in 2018 when she started
                uploading covers of popular Afrobeat and R&B songs on YouTube. Her soulful
                rendition of Sade’s “By Your Side” went viral, attracting over two million
                views and catching the attention of local music producers.
            </p>

            <p className="mb-6">
                This exposure led to her first recording sessions at Sarz’s studio in
                Lekki, Lagos. Between 2019 and 2021, she performed at underground venues
                such as Terra Kulture, Bogobiri House, and Freedom Park, becoming a notable
                figure in Lagos’ alternative music scene.
            </p>

            <p className="mb-6">
                During this period, she released independent singles including
                <em> Lagos Nights</em> (2019), <em>Waiting</em> (2020), and <em>Golden</em> (2021),
                which earned her a modest but loyal following.
            </p>

            <p className="mb-6">
                In 2022, Agofure spent six months in London collaborating with producers
                such as Juls and immersing herself in the UK Afrobeats and R&B scene. She
                also trained under renowned vocal coach Joanna Eden, significantly
                expanding her vocal range and control.
            </p>

            {/* Personal Life */}
            <h2 className="text-2xl font-semibold text-[#053B3A] mt-10 mb-4">
                Personal Life and Advocacy
            </h2>

            <p className="mb-10">
                Currently based in Lagos with a second residence in London, Agofure
                maintains a relatively private personal life. She is a strong advocate
                for mental health awareness and women’s education in Africa, actively
                partnering with NGOs to support underprivileged girls’ access to education.
            </p>

            <Footer />
        </main>
    );
};

export default SingleHistory;
