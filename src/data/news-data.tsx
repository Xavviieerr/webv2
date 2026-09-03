export interface NewsItem {
    id: number
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    image: string
    content?: string
    author?: string
    tags?: string[]
  }
  
  export const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "New Federal Scholarship Program Launches for STEM Students",
      excerpt:
        "The government announces a $50 million scholarship initiative targeting science, technology, engineering, and mathematics students nationwide.",
      category: "Scholarships",
      date: "Dec 15, 2024",
      readTime: "3 min read",
      image: "https://www.nairaland.com/attachments/5265513_img20170319wa0106_jpeg1d4e03f8267282a166f3c26c6194a9b4",
      author: "Sarah Johnson",
      tags: ["STEM", "Federal", "Scholarships"],
      content: `
        <p>The federal government has announced a groundbreaking $50 million scholarship initiative specifically designed to support students pursuing degrees in science, technology, engineering, and mathematics (STEM) fields.</p>
        
        <p>This comprehensive program aims to address the growing demand for skilled professionals in STEM industries while making higher education more accessible to students from diverse backgrounds.</p>
        
        <h3>Program Highlights</h3>
        <ul>
          <li>Up to $10,000 per year for undergraduate students</li>
          <li>Up to $15,000 per year for graduate students</li>
          <li>Priority given to underrepresented minorities and first-generation college students</li>
          <li>Renewable for up to four years of undergraduate study</li>
        </ul>
        
        <p>Applications will open on January 15, 2025, with the first awards being distributed for the fall 2025 semester. Students must maintain a minimum 3.0 GPA and demonstrate financial need to remain eligible.</p>
        
        <p>This initiative represents the largest federal investment in STEM education scholarships in over a decade, reflecting the government's commitment to maintaining America's competitive edge in technology and innovation.</p>
      `,
    },
    {
      id: 2,
      title: "Top Universities Expand Need-Based Financial Aid Programs",
      excerpt:
        "Leading institutions increase funding for low-income students, making higher education more accessible than ever before.",
      category: "Education News",
      date: "Dec 12, 2024",
      readTime: "5 min read",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPv6xlp1zU4S2XoXyP5PVtfzxkaSsOa5jaBn2Jvc3BZZl1yfpNN_BrKFHqpNeU3sMhWo-8h37fT_BWQGnNjgaBJKmGhiF1ThSfqSmhsO9yxg_ZSIMQeWOKIUF2M2f2DUyH-XS0WfVd7rk/s1600/Ukodo+recipe+yam+peppersoup+sisiyemmie.jpeg",
      author: "Michael Chen",
      tags: ["Financial Aid", "Universities", "Access"],
      content: `
        <p>Major universities across the country are significantly expanding their need-based financial aid programs, with some institutions now offering full tuition coverage for families earning less than $100,000 annually.</p>
        
        <p>This wave of enhanced financial support comes as universities recognize the critical importance of making higher education accessible to students from all economic backgrounds.</p>
        
        <h3>Notable Program Expansions</h3>
        <p>Harvard University has increased its income threshold for free tuition to families earning up to $85,000, while Stanford University now covers full tuition and room and board for families earning less than $75,000.</p>
        
        <p>These programs are part of a broader trend among elite institutions to reduce student debt and increase socioeconomic diversity on their campuses.</p>
        
        <p>The impact has been immediate, with applications from low-income students increasing by 40% at participating institutions compared to the previous year.</p>
      `,
    },
    {
      id: 3,
      title: "International Student Exchange Programs Resume Post-Pandemic",
      excerpt:
        "Study abroad opportunities return to pre-2020 levels as universities worldwide reopen their doors to international students.",
      category: "International",
      date: "Dec 10, 2024",
      readTime: "4 min read",
      image: "https://sarauta.net/wp-content/uploads/2022/09/Urhobo-people1.jpg",
      author: "Elena Rodriguez",
      tags: ["Study Abroad", "International", "Exchange"],
      content: `
        <p>International student exchange programs are experiencing a remarkable resurgence, with participation rates now matching and in some cases exceeding pre-pandemic levels.</p>
        
        <p>Universities worldwide have implemented comprehensive health and safety protocols while streamlining visa processes to facilitate international academic mobility.</p>
        
        <h3>Recovery Statistics</h3>
        <p>Data shows that study abroad participation has increased by 25% compared to 2023, with European destinations leading the recovery followed by Asian and Latin American programs.</p>
        
        <p>New virtual exchange components have been integrated into traditional programs, offering hybrid experiences that combine in-person cultural immersion with digital collaboration.</p>
        
        <p>Students report high satisfaction rates with these enhanced programs, citing improved global perspectives and enhanced career prospects as key benefits.</p>
      `,
    },
    {
      id: 4,
      title: "Merit-Based Scholarships See Record Applications This Year",
      excerpt:
        "Academic excellence scholarships receive unprecedented interest as students seek alternatives to traditional funding.",
      category: "Scholarships",
      date: "Dec 8, 2024",
      readTime: "2 min read",
      image: "https://rexclarkeadventures.com/wp-content/uploads/2024/08/nigerian-yam-pepper-soup-ukodo.jpg",
      author: "David Park",
      tags: ["Merit", "Scholarships", "Applications"],
      content: `
        <p>Merit-based scholarship programs across the nation are reporting record-breaking application numbers, with some programs seeing increases of up to 60% compared to previous years.</p>
        
        <p>This surge reflects students' growing awareness of scholarship opportunities and their desire to minimize educational debt through academic achievement.</p>
        
        <h3>Application Trends</h3>
        <p>The most competitive programs are those offering full-ride scholarships, with acceptance rates dropping to single digits at many institutions.</p>
        
        <p>Students are increasingly applying to multiple scholarship programs, with the average applicant submitting 8-12 applications compared to 4-6 in previous years.</p>
        
        <p>Scholarship committees are adapting by implementing more holistic review processes that consider community service, leadership experience, and personal essays alongside academic metrics.</p>
      `,
    },
    {
      id: 5,
      title: "Digital Learning Platforms Transform Higher Education",
      excerpt:
        "Universities embrace hybrid learning models, combining traditional classroom experiences with cutting-edge technology.",
      category: "Technology",
      date: "Dec 5, 2024",
      readTime: "6 min read",
      image: "https://nigeriannewsdirect.com/wp-content/uploads/2024/07/education.jpg",
      author: "Lisa Wang",
      tags: ["EdTech", "Digital Learning", "Innovation"],
      content: `
        <p>The integration of digital learning platforms in higher education has reached a tipping point, with 95% of universities now offering some form of hybrid or fully online programs.</p>
        
        <p>These platforms are not merely digitizing traditional content but are creating entirely new pedagogical approaches that enhance student engagement and learning outcomes.</p>
        
        <h3>Technological Innovations</h3>
        <p>Artificial intelligence is being used to personalize learning paths, while virtual and augmented reality technologies are creating immersive educational experiences previously impossible in traditional classrooms.</p>
        
        <p>Students report higher satisfaction rates with courses that effectively blend digital and in-person elements, citing flexibility and enhanced interactivity as key advantages.</p>
        
        <p>The transformation is also making education more accessible to non-traditional students, including working adults and those in remote locations.</p>
      `,
    },
    {
      id: 6,
      title: "Community College Transfer Programs Gain Momentum",
      excerpt:
        "Partnerships between community colleges and four-year universities create seamless pathways for student success.",
      category: "Education News",
      date: "Dec 3, 2024",
      readTime: "4 min read",
      image: "https://www.nairaland.com/attachments/12072190_img20200805225954401_jpegd8870753889c93931d6a3048d4e5e4ef",
      author: "Robert Martinez",
      tags: ["Community College", "Transfer", "Partnerships"],
      content: `
        <p>Community college transfer programs are experiencing unprecedented growth, with new partnerships between two-year and four-year institutions creating clear pathways for student advancement.</p>
        
        <p>These programs are designed to make higher education more affordable and accessible while maintaining academic rigor and quality.</p>
        
        <h3>Program Benefits</h3>
        <p>Students can complete their first two years at community college at a fraction of the cost, then seamlessly transfer to complete their bachelor's degree at partner universities.</p>
        
        <p>Many programs now offer guaranteed admission to partner institutions for students who meet specific academic criteria, providing certainty and motivation for community college students.</p>
        
        <p>The success rate of transfer students has improved significantly, with 85% of participants completing their bachelor's degrees within two years of transfer.</p>
      `,
    },
  ]
  
  export function getNewsItem(id: number): NewsItem | undefined {
    return newsItems.find((item) => item.id === id)
  }
  
  export function getAllNewsItems(): NewsItem[] {
    return newsItems
  }
  