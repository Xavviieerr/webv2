"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { usePathname } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
// import { useRouter } from "next/navigation";

const TermsAndConditions = () => {
  const { t, i18n } = useTranslation("common");
  // const router = useRouter();
  useEffect(() => {
    if (i18n.language !== "en") {
      i18n.changeLanguage("en");
    }
  }, [i18n]);

  const sections = [
    {
      title: "Effective Upon Use",
      content:
        'Welcome to Guọnọ Dictionary ("Guọnọ" or "App"), managed by GUỌNỌ. These Terms & Conditions ("Terms") govern your use of the App and all related services. By accessing or using the App, you agree to be bound by these Terms. If you do not agree, please discontinue use immediately.',
    },
    {
      title: "1. PURPOSE OF USE",
      content:
        "Guọnọ Dictionary is an educational and cultural platform designed for:",
      points: [
        "Personal learning and enrichment",
        "Linguistic and cultural research",
        "Promoting everyday use of the Urhobo language",
      ],
      additional:
        "We encourage open access and respectful usage that supports Urhobo language revitalization and awareness. The App is intended for educational purposes. It does not replace formal linguistic training, academic validation, or professional translation services.",
    },
    {
      title: "2. DEFINITIONS",
      content:
        "For clarity in interpreting these Terms:",
      points: [
        '"User" — any individual accessing or using the App.',
        '"Contributor" — any User granted access to the GUỌNỌ Admin Panel or submission tools.',
        '"Contributor Content" — any word, meaning, sentence, audio, image, video, or metadata uploaded by a Contributor.',
        '"Service" — the Guọnọ App, website, dictionary, games, database, APIs, and any associated platforms managed by GUỌNỌ.',
      ],
    },
    {
      title: "3. CONTENT SHARING & INTELLECTUAL PROPERTY",
      content:
        "Content within Guọnọ Dictionary—definitions, examples, lessons—may be freely copied, shared, and redistributed without restriction. Users may promote the language with or without attribution.",
      points: [
        "The platform's structure, organization, games, and system design are the intellectual property of GUỌNỌ.",
        "Users must not misrepresent Guọnọ content.",
        "Users must not use the content for harmful, defamatory, or illegal purposes.",
        "Users must not present themselves as official representatives of GUỌNỌ.",
        "Any content submitted must be original or submitted with full legal rights.",
        "GUỌNỌ is not responsible for intellectual property infringements within User submissions.",
      ],
    },
    {
      title: "4. ACCOUNT REGISTRATION & SECURITY",
      content:
        "Users must:",
      points: [
        "Provide accurate information",
        "Keep login credentials confidential",
        "Take responsibility for all activities under their account",
      ],
      additional:
        "Accounts may be suspended or terminated for violations of these Terms.",
    },
    {
      title: "5. EYEYONO — A LIVING LEARNING SYSTEM",
      content:
        "Guọnọ Dictionary reflects the principle of Eyeyono—continuous learning and growth. Because language evolves, content may be modified, corrected, or updated as knowledge increases.",
    },
    {
      title: "6. GAME FEATURES AND POINTS",
      content:
        "The App includes interactive games to promote learning.",
      points: [
        "Points earned may be redeemable with future partners.",
        "There are no paid features at this time.",
        "GUỌNỌ may modify or remove game features at any time.",
      ],
    },
    {
      title: "7. USER SUBMISSIONS & POSTED CONTENT",
      content:
        "Users may submit words, corrections, notes, or other forms of content.",
      points: [
        "By submitting content, you grant GUỌNỌ a global, royalty-free, perpetual, irrevocable license to use, modify, store, adapt, publish, distribute, and display your submission.",
        "You affirm that you have the legal right to provide this content.",
        "GUỌNỌ may reject, edit, remove, or reorganize any submission at any time.",
      ],
    },
    {
      title: "8. ADMIN PANEL CONTRIBUTORS & DATABASE CONTRIBUTIONS",
      content:
        "Users granted access to the Admin Panel (\"Contributors\") may upload or edit:",
      points: [
        "Words and meanings",
        "Example sentences",
        "Pronunciations and audio",
        "Images, illustrations, and videos",
        "Cultural notes and metadata",
      ],
      subsections: [
        {
          title: "Copyright Ownership",
          content: "Contributors retain copyright ownership of original material they create.",
        },
        {
          title: "License Granted to GUỌNỌ",
          content:
            "By submitting or uploading Contributor Content, you grant GUỌNỌ a worldwide, royalty-free, irrevocable, perpetual, transferable, fully sublicensable, non-exclusive license to use, reproduce, adapt, modify, translate, store, publish, broadcast, distribute, commercialize, and create derivative works from your content in all media formats, including:",
          points: [
            "Dictionaries",
            "Learning materials",
            "Marketing",
            "Social platforms",
            "AI training datasets",
            "Future GUỌNỌ products, apps, or services",
          ],
        },
        {
          title: "Moral Rights Waiver",
          content:
            "To the extent allowed by law, you waive any moral rights associated with Contributor Content. Where such rights cannot be waived, you agree not to exercise them against GUỌNỌ.",
        },
        {
          title: "Contributor Responsibilities",
          content: "Contributors affirm that they:",
          points: [
            "Own or have rights to all uploaded content",
            "Will not upload illegal, infringing, or harmful material",
            "Understand their work may be edited or removed",
          ],
        },
        {
          title: "No Compensation",
          content:
            "Unless stated under a separate written contract, contributions are voluntary and unpaid.",
        },
        {
          title: "Access Revocation",
          content:
            "GUỌNỌ may revoke Admin Panel access at any time. The license granted survives termination.",
        },
      ],
    },
    {
      title: "9. ACCEPTABLE USE",
      content: "Users must not:",
      points: [
        "(a) Post disrespectful, misleading, harmful, or abusive content",
        "(b) Misuse features or manipulate game systems",
        "(c) Impersonate GUỌNỌ personnel",
        "(d) Upload viruses, harmful code, or attempts to disrupt the App",
        "(e) Engage in harassment or harmful behavior toward other users",
      ],
      additional:
        "Violations may result in suspension or permanent removal from the App.",
    },
    {
      title: "10. CULTURAL & DIALECT DISCLAIMER",
      content:
        "Urhobo contains many dialects.",
      points: [
        "GUỌNỌ aims to represent widely accepted, commonly understood forms.",
        "Not all dialect variations may be represented.",
        "Users should consult elders, scholars, or community experts for dialect-specific validation.",
      ],
    },
    {
      title: "11. SERVICE AVAILABILITY",
      content:
        "GUỌNỌ does not guarantee uninterrupted or error-free access.",
      points: [
        "Features may be modified, suspended, or discontinued at any time.",
        "GUỌNỌ is not liable for loss of data, downtime, or technical interruptions.",
      ],
    },
    {
      title: "12. LIMITATION OF LIABILITY",
      content:
        'The Service is provided "as is" and "as available."',
      points: [
        "GUỌNỌ makes no warranties regarding accuracy of content, reliability of linguistic information, suitability of content for professional use, or availability or performance of the App.",
        "GUỌNỌ will not be liable for damages resulting from reliance on dictionary content, loss of data or points, third-party misuse of content, or errors, omissions, or dialect variations.",
      ],
      additional:
        "Use the App at your own discretion and risk.",
    },
    {
      title: "13. MINORS",
      content:
        "Users under the lawful age of digital consent (13 or as defined by local law) must obtain parental or guardian permission.",
      additional:
        "GUỌNỌ does not knowingly collect personal data from children without appropriate consent.",
    },
    {
      title: "14. GOVERNING LAW & MODIFICATIONS",
      content:
        "These Terms are governed by the laws of the Republic of Korea.",
      points: [
        "Disputes will be resolved through the courts of Korea.",
        "GUỌNỌ may modify these Terms at any time. Changes become effective upon posting.",
      ],
    },
    {
      title: "15. PRIVACY POLICY",
      content:
        "Your privacy is important to us. Please review our Privacy Policy to understand how your data is collected and protected.",
    },
    {
      title: "16. CONTACT",
      content:
        "For support, questions, or partnership inquiries, contact us through the official website or our social media channels.",
      additional:
        "GUỌNỌ welcomes collaboration, sponsorship, and contributions from individuals and organizations passionate about the Urhobo language and culture.",
    },
  ];

  return (
    <>
      {/* Back Button (Fixed Left) */}
      <button
        onClick={() => window.history.back()}

        className="fixed lg:top-20 top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-[#05353A] text-white hover:bg-[#06494f] transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white/60"
        aria-label="Go back"
      >
        <IoArrowBack size={22} className="text-white" />
        <span className="text-sm font-medium">Back</span>
      </button>


      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#05353A] p-6 sm:p-8 text-white text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              {t("Terms and Conditions")}
            </h2>
            <p className="text-lg opacity-90">
              {t("Last updated:")}{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-lg max-w-none">
              {sections.map((section, index) => (
                <section key={index} className="mb-10 last:mb-0">
                  <h3 className="text-2xl font-bold text-[#05353A] mb-4">
                    {t(section.title)}
                  </h3>
                  {section.content && (
                    <p className="text-gray-700 mb-4">{t(section.content)}</p>
                  )}

                  {section.points && (
                    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                      {section.points.map((point, i) => (
                        <li key={i}>{t(point)}</li>
                      ))}
                    </ul>
                  )}

                  {section.subsections && (
                    <div className="mt-4 space-y-6">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="ml-4">
                          <h4 className="text-xl font-semibold text-[#05353A] mb-2">
                            {t(subsection.title)}
                          </h4>
                          {subsection.content && (
                            <p className="text-gray-700 mb-2">{t(subsection.content)}</p>
                          )}
                          {subsection.points && (
                            <ul className="list-disc pl-6 mb-2 space-y-2 text-gray-700">
                              {subsection.points.map((point, i) => (
                                <li key={i}>{t(point)}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.additional && (
                    <p className="text-gray-700">{t(section.additional)}</p>
                  )}
                </section>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                {t(
                  "By using Guọnọ, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions."
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TermsAndConditions;

