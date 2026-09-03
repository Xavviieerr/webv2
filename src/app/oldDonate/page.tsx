"use client";

import { useState} from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useGetWalletAddressesQuery, useSubmitDonationMutation } from "@/slice/donationEndpoints";
import { FaCopy, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Header from "../../components/layouts/Header";
import ButtonSpinner from "../../components/ButtonSpinner";
import Footer from "../../components/layouts/Footer";
import { motion } from "framer-motion";

const donationList = [
  { heading: "donateListDocumenting" },
  { heading: "donateListEducation" },
  { heading: "donateListApps" },
  { heading: "donateListEvents" },
];

interface CryptoAddressProps {
  address: string;
  label: string;
  network: string;
  instructions: string;
  buttonText: string;
  buttonColor: string;
  onDonated: (label: string, address: string, network: string) => void;
}

const CryptoAddress = ({
  address,
  buttonText,
  onDonated,
  buttonColor,
  label,
  network,
  instructions,
}: CryptoAddressProps) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation("common");

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success(t("donateCopySuccess"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md w-full min-w-0 max-w-full">
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{t("donateWalletAddress")}</p>
        <div className="flex items-center gap-2 mb-4">
          <p className="font-mono bg-gray-50 border border-gray-200 p-2 sm:p-3 truncate rounded-lg break-all flex-1 min-w-0 text-xs md:text-sm text-gray-800">
            {address}
          </p>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0 border border-gray-200"
            aria-label="Copy address"
          >
            {copied ? (
              <span className="text-green-600 text-sm font-bold">✓</span>
            ) : (
              <FaCopy className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
            <p className="text-xs md:text-sm text-blue-800 leading-relaxed">{instructions}</p>
          </div>
        </div>

        {/* Network Warning */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-3">
          <p className="text-xs text-amber-800 font-semibold">
            {t("donateNetworkWarning")
              .replace("{currency}", label)
              .replace("{network}", network)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDonated(label, address, network)}
        className="w-full py-3 rounded-lg font-semibold text-white cursor-pointer transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
    </div>
  );
};

const DonatePage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [donated, setDonated] = useState(false);
  const [collected, setCollected] = useState(false); // form completed
  const [form, setForm] = useState({ name: "", email: "" });
  const [selectedCrypto, setSelectedCrypto] = useState<{
    label: string;
    address: string;
    network: string;
  } | null>(null);
  const { data: walletAddresses = { bitcoin: "", solana: "", usdt: "" }, isLoading: loadingAddresses } =
    useGetWalletAddressesQuery();
  const [submitDonationMutation] = useSubmitDonationMutation();

  const { t } = useTranslation("common");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (selectedCrypto) {
      try {
        await submitDonationMutation({
          name: form.name,
          email: form.email,
          currency: selectedCrypto.label,
          address: selectedCrypto.address,
          network: selectedCrypto.network,
        }).unwrap();
        setCollected(true);
      } catch {
        // Toast handled in mutation
      }
      setSubmitting(false);
    } else {
      setSubmitting(false);
      setCollected(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#05353A] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold mb-6">
                {t("donateSupportHeading")}
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed">
                {t("donateSupportSubheading")}
              </p>
            </motion.div>
            {/* Image */}
            <motion.div
              className="flex justify-center md:justify-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md aspect-square md:aspect-auto">
                <Image
                  src="/donate-2.jpg"
                  alt="Donate to support Urhobo language and culture"
                  width={500}
                  height={500}
                  className="rounded-xl shadow-2xl w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Mission and Helps Cards - Side by Side on Desktop */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Our Mission Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-[#05353A] to-[#065a63] p-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  {t("ourMission")}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
                  {t("donateMissionParagraph1")}
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {t("donateMissionParagraph2")}
                </p>
              </div>
            </div>

            {/* How Your Donation Helps Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-[#05353A] to-[#065a63] p-6">
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  {t("donateHelpsHeading")}
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {donationList.map((item, index) => (
                    <li className="flex items-start gap-3" key={index}>
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-[#05353A] flex items-center justify-center">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                      </div>
                      <span className="text-base md:text-lg text-gray-800 leading-relaxed flex-1">
                        {t(item.heading)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Donation Options Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-[#05353A] to-[#065a63] p-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-white text-center">
                {t("donateNow")}
              </h2>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              {donated ? (
                collected ? (
                  // Thank You message
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                      <span className="text-green-600 text-4xl font-bold">✓</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
                      {t("donateThankYou")}
                    </h3>
                    <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      {t("donateThanksBody")}
                    </p>
                    <button
                      onClick={() => {
                        setDonated(false);
                        setCollected(false);
                        setForm({ name: "", email: "" });
                        setSelectedCrypto(null);
                      }}
                      className="bg-[#05353A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#065a63] transition-colors shadow-md hover:shadow-lg"
                    >
                      {t("donateMakeAnother")}
                    </button>
                  </div>
                ) : (
                  // Collect name & email form
                  <form onSubmit={handleFormSubmit} className="space-y-6 max-w-md mx-auto">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-6">
                      {t("donateThankYou")}
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("enterNames")}
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#05353A] focus:ring-2 focus:ring-[#05353A]/20 transition bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("emailAddress")}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#05353A] focus:ring-2 focus:ring-[#05353A]/20 transition bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#05353A] flex gap-x-2 justify-center items-center text-white py-3 rounded-lg font-semibold hover:bg-[#065a63] transition-colors shadow-md hover:shadow-lg mt-6"
                    >
                      <span>{t("continue")}</span>
                      {submitting && (<ButtonSpinner />)}
                    </button>
                  </form>
                )
              ) : (
                <>
                  <p className="text-base md:text-lg text-gray-600 mb-8 text-center">
                    {t("donateChooseMethod")}
                  </p>

                  {loadingAddresses ? (
                    <div className="text-center py-12">
                      <ButtonSpinner />
                      <p className="text-gray-600 mt-4 font-medium">{t("loading")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {/* Bitcoin */}
                      {walletAddresses.bitcoin && (
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center flex-wrap gap-2">
                            <span className="bg-orange-100 text-orange-800 p-2 rounded-full">
                              <Image
                                src="/bitcoin.svg"
                                alt="Bitcoin"
                                width={20}
                                height={20}
                                className="h-5 w-5"
                              />
                            </span>
                            <span className="text-center">{t("donateBitcoinHeading")}</span>
                          </h3>
                          <CryptoAddress
                            address={walletAddresses.bitcoin}
                            buttonColor="#f7931a"
                            label="Bitcoin"
                            network="Bitcoin"
                            instructions={t("donateBitcoinInstructions")}
                            buttonText={t("donateSentBitcoin")}
                            onDonated={(label, address, network) => {
                              setSelectedCrypto({ label, address, network });
                              setDonated(true);
                            }}
                          />
                        </div>
                      )}

                      {/* Solana */}
                      {walletAddresses.solana && (
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 p-2 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 397 311"
                                className="h-5 w-5"
                              >
                                <linearGradient
                                  id="sol"
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="100%"
                                >
                                  <stop offset="0%" stopColor="#00FFA3" />
                                  <stop offset="100%" stopColor="#DC1FFF" />
                                </linearGradient>
                                <path
                                  fill="url(#sol)"
                                  d="M64 238a12 12 0 0112-12h307a6 6 0 014 10l-64 63a12 12 0 01-8 3H8a6 6 0 01-4-10l60-54zM64 131a12 12 0 0112-12h307a6 6 0 014 10l-64 63a12 12 0 01-8 3H8a6 6 0 01-4-10l60-54zM64 24A12 12 0 0176 12h307a6 6 0 014 10l-64 63a12 12 0 01-8 3H8a6 6 0 01-4-10l60-54z"
                                />
                              </svg>
                            </span>
                            <span className="text-center">{t("donateSolanaHeading")}</span>
                          </h3>
                          <CryptoAddress
                            address={walletAddresses.solana}
                            buttonColor="#14f195"
                            label="Solana"
                            network="Solana"
                            instructions={t("donateSolanaInstructions")}
                            buttonText={t("donateSentSolana")}
                            onDonated={(label, address, network) => {
                              setSelectedCrypto({ label, address, network });
                              setDonated(true);
                            }}
                          />
                        </div>
                      )}

                      {/* USDT (TRC-20) */}
                      {walletAddresses.usdt && (
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center flex-wrap gap-2">
                            <span className="bg-green-100 text-green-800 p-2 rounded-full">
                              <Image
                                src="/usdt.svg"
                                alt="USDT"
                                width={20}
                                height={20}
                                className="h-5 w-5"
                              />
                            </span>
                            <span className="text-center">{t("donateUsdtTrc20Heading")}</span>
                          </h3>
                          <CryptoAddress
                            address={walletAddresses.usdt}
                            buttonColor="#26a17b"
                            label="USDT"
                            network="TRC-20 (Tron)"
                            instructions={t("donateUsdtInstructions")}
                            buttonText={t("donateSentUsdt")}
                            onDonated={(label, address, network) => {
                              setSelectedCrypto({ label, address, network });
                              setDonated(true);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                    <p className="text-sm text-gray-600 text-center font-medium">
                      {t("donateDisclaimer")}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;

