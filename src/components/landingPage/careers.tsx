import Image from "next/image";
import Link from "next/link";
import { JoinTheUrhoboWorld } from "../newlayout/jointheurhoboWorld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CareersHeroSection = () => {
  return (
    <div className="max-w-[1400px] mx-auto rounded-[52px] bg-secondary py-8 px-6 lg:px-10 lg:py-16 lg:mt-10 overflow-hidden relative min-h-[500px] sm:min-h-[600px]">
      {/* Decorative shapes from illustration-4.svg - positioned top-left */}
      <div className="absolute top-0 left-0 w-[200px] sm:w-[250px] lg:w-[300px] h-[200px] sm:h-[250px] lg:h-[300px] opacity-80 z-0">
        <Image
          src="/illustration-4.svg"
          alt="Decorative shapes"
          fill
          className="object-contain object-top-left"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 justify-between relative z-10">
        {/* Left Section - Content */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-8 max-w-2xl">
          {/* Headlines */}
          <div className="flex flex-col gap-2 sm:gap-3 mt-10 lg:mt-0">
            <Image
              src="/guono-logo.svg"
              alt="Guọnọ Logo"
              width={180}
              height={50}
              className="w-[180px] h-[50px]"
            />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#D68B00] leading-tight">
              Contributor Program
            </h2>
          </div>

          {/* Paragraph */}
          <p className="text-base sm:text-lg lg:text-xl text-[#241624] leading-relaxed max-w-xl">
            The GUỌNO Contributor Program is a structured, community-driven
            initiative focused on building a reliable, culturally grounded
            digital resource for Urhobo.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
            <Link
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-[#0D4D4D] text-white font-semibold text-base sm:text-lg hover:bg-[#0D4D4D]/90 transition-colors"
            >
              Apply to Contribute
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-white border-2 border-[#0AB3C6] text-[#0D4D4D] font-semibold text-base sm:text-lg hover:bg-[#0D4D4D]/5 transition-colors"
            >
              Learn how it works
            </Link>
          </div>
        </div>

        {/* Right Section - Main Illustration */}
        <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-lg xl:max-w-xl relative">
          {/* Main illustration from ilustration-3.svg */}
          <Image
            src="/ilustration-3.svg"
            alt="Contributor program illustration"
            width={500}
            height={500}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

const WhatisGuonoContributorProgram = () => {
  const programFeatures = [
    {
      title: "Expand the Urhobo Lexicon",
      description: "Build a rich and evolving digital vocabulary.",
      // highlighted: true // First item has light blue/teal background
    },
    {
      title: "Standardize Language Usage",
      description: "Ensure consistent spelling, meaning, and structure.",
    },
    {
      title: "Revive Culture & History",
      description: "Safeguard linguistic and cultural knowledge.",
    },
    {
      title: "Enable Global Access",
      description: "Make Urhobo accessible to learners worldwide.",
    },
  ];

  return (
    <div className="w-full max-w-[1700px] mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full justify-between flex-col lg:flex-row items-start lg:items-start gap-8 lg:gap-12">
        {/* Left Column - Text Content */}
        <div className="flex-1 flex max-w-3xl flex-col gap-6 sm:gap-8 w-full lg:w-auto">
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[39px] font-bold text-[#241624] leading-tight">
            About{" "}
            <span className="text-[#0D4D4D]">
              GUỌNỌ <br />
            </span>{" "}
            Contributor Program?
          </h2>

          {/* Descriptive Paragraph */}
          <p className="text-base sm:text-lg lg:text-xl text-[#241624] leading-relaxed">
            This program brings together native speakers, educators, and
            cultural experts to collaboratively document, review, and
            standardize Urhobo in digital form.
          </p>

          {/* Program Features List */}
          <div className="flex flex-col w-full">
            {programFeatures.map((feature, index) => (
              <div key={index}>
                <div
                  className={`py-4 sm:py-5 ${"px-6 hover:bg-[#F0F8FA] transition-colors"}`}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-[#241624] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#241624]">
                    {feature.description}
                  </p>
                </div>
                {index < programFeatures.length - 1 && (
                  <div className="border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Illustration */}
        <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-lg xl:max-w-xl mt-8 lg:mt-0">
          <div className="relative w-full rounded-xl overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/guono-culture.svg"
              alt="Guọnọ culture illustration"
              width={522}
              height={599}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const WhoCanApply = () => {
  const criteria = [
    "A native Urhobo speaker",
    "A teacher of the Urhobo language",
    "A student or graduate of Urhobo studies",
    "Able to read, write, hear, and speak Urhobo",
    "Knowledgeable in Urhobo culture, history, or traditions",
    "Passionate about developing the Urhobo language",
  ];

  return (
    <div className="w-full bg-[#FBF5EA] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top Right - Wavy line (Vector-4.svg) */}
      <div className="absolute bottom-0 left-0 w-[174px] h-[121px] opacity-80 z-0">
        <Image
          src="/Vector-4.svg"
          alt="Decorative wavy line"
          width={174}
          height={121}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Bottom Left - Undulating line (Vector.svg) */}
      <div className="absolute right-70 bottom-[60] w-[53px] h-[62px] opacity-50 z-0">
        <Image
          src="/Vector.svg"
          alt="Decorative undulating line"
          width={53}
          height={62}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="absolute top-[-30] right-30 w-[80px] h-[130px] z-0">
        <Image
          src="/vector-1.svg"
          alt="Decorative wavy line"
          width={80}
          height={130}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-[1700px] mx-auto relative z-10">
        <div className="flex w-full justify-between lg:gap-50  flex-col lg:flex-row items-start lg:items-center gap-8 ">
          {/* Left Column - Image Card */}

          <Image
            src="/griot.svg"
            alt="Griot illustration"
            width={522}
            height={599}
            className="w-[518px] h-[383px]"
            priority
          />

          {/* Right Column - Text Content */}
          <div className=" w-full max-w-3xl flex flex-col gap-6 sm:gap-8">
            {/* Heading */}
            <h2 className="text-2xl lg:text-5xl font-bold text-[#1E5059] leading-tight">
              Who Can Apply?
            </h2>

            {/* Introductory Sentence */}
            <p className="text-[18px] lg:text-[26px] text-[#4F4F4F] leading-relaxed">
              You may apply if you are any of the following:
            </p>

            {/* Bulleted List */}
            <ul className="flex flex-col gap-3 sm:gap-4 mt-2">
              {criteria.map((item, index) => (
                <li
                  key={index}
                  className="max-w-[700px] flex items-start gap-3 px-6"
                >
                  <span className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0"></span>
                  <span className="text-[18px] lg:text-[26px] text-[#4F4F4F] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowTheProgramWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Apply",
      description:
        "Submit an application to share your background and language experience.",
    },
    {
      number: 2,
      title: "Language Assessment",
      description:
        "Selected applicants complete a basic language assessment to evaluate readiness.",
    },
    {
      number: 3,
      title: "Test Platform",
      description:
        "Successful applicants gain access to a guided test environment to practice contributions.",
    },
    {
      number: 4,
      title: "Review & Feedback",
      description:
        "Submissions are reviewed. Feedback and revisions may be required.",
    },
    {
      number: 5,
      title: "Live Access",
      description:
        "Approved contributors gain access to the live platform and begin contributing officially.",
    },
  ];

  return (
    <div
      id="how-it-works"
      className="w-full bg-[#253F42] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Title and Subtitle */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            How the Program Works
          </h2>
          {/* <div className="flex flex-col gap-1">
                        <p className="text-base sm:text-lg lg:text-xl text-white">
                            Most calendars are designed for teams.
                        </p>
                        <p className="text-base sm:text-lg lg:text-xl text-white">
                            Slate is designed for freelancers
                        </p>
                    </div> */}
        </div>

        {/* Process Steps Grid */}
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Row 1 - Three cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl">
            {steps.slice(0, 3).map((step) => (
              <div
                key={step.number}
                className="group p-6 sm:p-8 rounded-xl w-full shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:scale-105 hover:border-[#E0E0E0] bg-white hover:bg-[#2F7C85]"
              >
                {/* Numbered Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 bg-[#48CBFF] group-hover:bg-[#E5D0A1]">
                    <span className="text-xl font-bold transition-colors duration-300 text-white group-hover:text-[#222222]">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 transition-colors duration-300 text-[#241624] group-hover:text-[#F5E2BC]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-center leading-relaxed transition-colors duration-300 text-gray-600 group-hover:text-[#F5E2BC]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Row 2 - Two cards (centered) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
            {steps.slice(3).map((step) => (
              <div
                key={step.number}
                className="group p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:scale-105 hover:border-[#E0E0E0] bg-white hover:bg-[#2F7C85]"
              >
                {/* Numbered Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 bg-[#48CBFF] group-hover:bg-[#E5D0A1]">
                    <span className="text-xl font-bold transition-colors duration-300 text-white group-hover:text-[#222222]">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-3 transition-colors duration-300 text-[#241624] group-hover:text-[#F5E2BC]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-center leading-relaxed transition-colors duration-300 text-gray-600 group-hover:text-[#F5E2BC]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const faqItems = [
  {
    question: "Do I need to be fluent in Urhobo?",
    answer:
      "Basic fluency is sufficient. You will continue learning as you contribute.",
  },
  {
    question: "Is this a paid program?",
    answer:
      "The Contributor Program is a volunteer initiative. Contributors participate to support the Urhobo language and culture.",
  },
  {
    question: "Can I leave the program?",
    answer:
      "Yes. You can leave the program at any time. We appreciate any contribution you can make.",
  },
  {
    question: "What if I make mistakes?",
    answer:
      "Mistakes are part of learning. Submissions are reviewed and feedback is provided. You can revise and improve with support from the team.",
  },
];

const FAQ = () => {
  return (
    <div className="w-fullpy-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          {/* <p className="text-sm font-semibold uppercase tracking-wider text-[#0A5F5A] mb-2">
            FAQ
          </p> */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241624] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#241624]">
            For more information, contact us.
          </p>
        </div>

        {/* Contact Us Button */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-[#0A5F5A] text-white font-semibold text-base sm:text-lg hover:bg-[#0A5F5A]/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Accordion */}
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="w-full"
        >
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger
                hideChevron
                className="text-base sm:text-lg font-bold text-[#241624] hover:no-underline py-5"
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-[#241624] pl-0 pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const dictionaryResponsibilities = [
  "Add new Urhobo words and meanings",
  "Contribute dialectal variations",
  "Propose new words where needed",
  "Write example sentences showing real usage",
  "Provide audio pronunciations (when required)",
  "Review and vote on submitted entries",
];

const adminResponsibilities = [
  "Guide grammatical rules and usage",
  "Research Urhobo language structure",
  "Define standards for word formation",
  "Clarify parts of speech and syntax",
  "Perform quality control on entries",
  "Verify historical and factual content",
];

const ContributorRoles = () => {
  return (
    <div className="w-fullpy-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1700px] mx-auto">
        {/* Main Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-semibold text-[#339C94] text-center mb-12 sm:mb-16 lg:mb-20">
          Contributor Roles
        </h2>

        {/* Dictionary Contributor Section - Text left, Illustration right */}
        <div className="flex flex-col px-4 lg:px-16 justify-between lg:flex-row items-center gap-8 mb-16 sm:mb-20 lg:mb-24">
          <div className="flex-1 max-w-[700px]">
            <h3 className="text-2xl lg:text-[40px] font-bold text-[#333333] mb-4">
              Dictionary Contributor
            </h3>
            <p className="text-[18px] lg:text-[24px] text-[#333333] leading-relaxed mb-6">
              Expand and enrich the Urhobo vocabulary through real-world usage
              and dialectal knowledge.
            </p>
            <h4 className="text-2xl lg:text-[24px] font-semibold text-[#339C94] mb-4">
              Responsibilities
            </h4>
            <ul className="flex flex-col gap-2 mb-6 px-6">
              {dictionaryResponsibilities.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-[18px] lg:text-[24px] gap-3 text-base text-[#333333]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#333333] mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[24px] font-bold text-[#333333] mb-2">
              Impact Note
            </p>
            <div className="rounded-lg bg-[#E8F8F7] p-4 sm:p-5 border border-[#339C94]/20">
              <p className="text-[16px] text-[#02474F] font-medium lg:text-[20px] leading-relaxed">
                Dictionary Contributors ensure the language reflects how Urhobo
                is truly spoken living, evolving, and contextual.
              </p>
            </div>
          </div>
          <Image
            src="/Illustration-1.svg"
            alt="Dictionary Contributor illustration"
            width={450}
            height={450}
            className="object-contain object-center"
          />
        </div>

        {/* Admin Contributor Section - Illustration left, Text right */}
        <div className="flex flex-col w-full justify-between lg:flex-row items-center gap-8 mb-16 sm:mb-20 lg:mb-24">
          <Image
            src="/Illustration.svg"
            alt="Dictionary Contributor illustration"
            width={450}
            height={450}
            className="object-contain object-center"
          />
          <div className="flex-1 max-w-[700px]">
            <h3 className="text-2xl lg:text-[40px] font-bold text-[#333333] mb-4">
              Admin Contributor
            </h3>
            <p className="text-[18px] lg:text-[24px] text-[#333333] leading-relaxed mb-6">
              Provide academic and structural oversight to ensure linguistic
              accuracy and consistency.
            </p>
            <h4 className="text-2xl lg:text-[24px] font-semibold text-[#339C94] mb-4">
              Responsibilities
            </h4>
            <ul className="flex flex-col gap-2 mb-6 px-6">
              {adminResponsibilities.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-[18px] lg:text-[24px] gap-3 text-base text-[#333333]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#333333] mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[24px] font-bold text-[#333333] mb-2">
              Impact Note
            </p>
            <div className="rounded-lg bg-[#E8F8F7] p-4 sm:p-5 border border-[#339C94]/20">
              <p className="text-[16px] text-[#02474F] font-medium lg:text-[20px] leading-relaxed">
                Admin Contributors protect the scholarly and cultural integrity
                of the GUONO ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Careers() {
  return (
    <>
      <CareersHeroSection />
      <WhatisGuonoContributorProgram />
      <WhoCanApply />
      <ContributorRoles />
      <HowTheProgramWorks />
      <FAQ />
      <div className="mx-auto w-full py-10 sm:py-12 lg:py-16">
        <JoinTheUrhoboWorld />
      </div>
    </>
  );
}
