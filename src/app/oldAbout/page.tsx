"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";
import { motion } from "framer-motion";

const About = () => {
  const { t } = useTranslation("common");
  
  return (
    <div className="w-full min-h-screen ">
      <Header />
      <main className="mx-auto px-4 py-16 max-w-4xl  ">
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            <h2 className="text-3xl font-bold text-[#053B3A] mb-6">
              {t("ourMission")}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {t("missionDescription")}
            </p>

            <div className="flex justify-center my-10">
              <div className="w-32 h-1 bg-[#053B3A] rounded-full"></div>
            </div>

            <h3 className="text-2xl font-semibold text-[#053B3A] mb-4">
              {t("urhoboLanguage")}
            </h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {t("languageDescription")}
            </p>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-[#053B3A] rounded-xl shadow-lg p-8 md:p-10 text-white">
            <h2 className="text-3xl font-bold mb-6">{t("ourVision")}</h2>
            <p className="text-lg mb-6 leading-relaxed">
              {t("visionDescription")}
            </p>
            <p className="text-lg leading-relaxed">
              {t("visionDescriptionAlt")}
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 text-center">
            <h2 className="text-3xl font-bold text-[#053B3A] mb-6">
              {t("ourFuture")}
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {t("futureDescription")}
            </p>
            <div className="flex justify-center">
              <Link
                href="https://chat.whatsapp.com/BvdjCflnxPDBO7TrGoNjZS?mode=ac_t"
                className=" bg-[#053B3A] text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md"
              >
                {t("joinOurMovement")}
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

