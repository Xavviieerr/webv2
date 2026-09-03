"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import Input from "../ui/Input";
import { Copy, CopyCheck, Wallet } from "lucide-react";
import { JoinTheUrhoboWorld } from "./jointheurhoboWorld";
import {
  bitcoinAddress,
  solanaAddress,
  usdtAddress,
} from "@/constants/crypto-addresses";

const DONATION_METHODS = [
  {
    id: "bitcoin" as const,
    label: "Bitcoin Donation",
    iconBg: "bg-[#F7931A]",
    iconLetter: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.6665 10.6666C2.6665 11.7172 2.87343 12.7575 3.27547 13.7281C3.67751 14.6987 4.26678 15.5806 5.00965 16.3235C5.75252 17.0663 6.63443 17.6556 7.60504 18.0577C8.57564 18.4597 9.61593 18.6666 10.6665 18.6666C11.7171 18.6666 12.7574 18.4597 13.728 18.0577C14.6986 17.6556 15.5805 17.0663 16.3234 16.3235C17.0662 15.5806 17.6555 14.6987 18.0575 13.7281C18.4596 12.7575 18.6665 11.7172 18.6665 10.6666C18.6665 9.61605 18.4596 8.57576 18.0575 7.60516C17.6555 6.63455 17.0662 5.75264 16.3234 5.00977C15.5805 4.2669 14.6986 3.67763 13.728 3.27559C12.7574 2.87355 11.7171 2.66663 10.6665 2.66663C9.61593 2.66663 8.57564 2.87355 7.60504 3.27559C6.63443 3.67763 5.75252 4.2669 5.00965 5.00977C4.26678 5.75264 3.67751 6.63455 3.27547 7.60516C2.87343 8.57576 2.6665 9.61605 2.6665 10.6666Z"
          stroke="#522205"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 7.11106H11.6356C12.5733 7.11106 13.3333 7.90661 13.3333 8.88883C13.3333 9.87106 12.5733 10.6666 11.6356 10.6666C12.5733 10.6666 13.3333 11.4622 13.3333 12.4444C13.3333 13.4266 12.5733 14.2222 11.6356 14.2222H8M8.88889 10.6666H12.4444M8.88889 6.22217V15.1111V7.11106M11.5556 6.22217V7.11106M11.5556 14.2222V15.1111"
          stroke="#522205"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "solana" as const,
    label: "Solana Donation",
    iconBg: "bg-[#9945FF]",
    iconLetter: "S",
  },
  {
    id: "usdt" as const,
    label: "USDT Donation",
    iconBg: "bg-[#26A17B]",
    iconLetter: "T",
  },
] as const;

type DonationMethod = "bitcoin" | "solana" | "usdt";

const CRYPTO_ADDRESSES: Record<DonationMethod, string> = {
  bitcoin: bitcoinAddress,
  solana: solanaAddress,
  usdt: usdtAddress,
};

type DonateFormValues = {
  donationMethod: DonationMethod;
  walletAddress: string;
};

const DonateHero = () => {
  return (
    <div className="relative">
      {/* Hero section: background + overlay + left-aligned text */}
      <section className="relative min-h-[50vh] lg:min-h-[55vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/guono-support.jpg"
            alt=""
            fill
            className="object-cover object-center lg:object-[40%_80%]"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/10 to-[#0a0a0a]/80"
            aria-hidden
          />
        </div>
        <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pb-10 lg:pb-14 pt-24">
          <div className="max-w-lg xl:max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] font-bold text-white leading-tight">
              Support
              <br />
              Urhobo
            </h1>
            <p className="text-xl sm:text-2xl text-white/95 mt-2 font-normal">
              Language and Culture
            </p>
          </div>
        </div>
      </section>

      {/* Content section: white bg, paragraph, dots in bottom-left */}
      <section className="relative py-12 sm:py-16 lg:py-20 min-h-[200px] lg:min-h-[200px]">
        {/* Dots: absolute bottom-left of this section */}
        <div
          className="absolute left-0 bottom-[-100px] z-10 w-[140px] h-[160px] sm:w-[180px] sm:h-[200px] lg:w-[200px] lg:h-[240px] pointer-events-none opacity-70"
          aria-hidden
        >
          <Image
            src="/longdots.svg"
            alt=""
            width={200}
            height={240}
            className="w-full h-full object-contain object-bottom-left"
          />
        </div>
        <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg sm:text-xl lg:text-[24px] leading-relaxed max-w-xl xl:max-w-lg pl-0 sm:pl-0">
            The Urhobo language and culture are a rich heritage that deserves to
            be Revived and promoted for future generations.
          </p>
        </div>
      </section>

      {/* Form card: overlaps hero (right) on desktop, below content on mobile/tablet */}
      <div
        className="relative lg:absolute lg:top-[18vh] lg:right-0 xl:right-[40px] z-20 mt-8 lg:mt-0 px-4 sm:px-6 lg:px-0"
        aria-label="Donation form"
      >
        <DonateFormCard />
      </div>
    </div>
  );
};

const methodLabel: Record<DonationMethod, string> = {
  bitcoin: "Bitcoin",
  solana: "Solana",
  usdt: "USDT",
};

const DonateFormCard = () => {
  const { control, watch, handleSubmit, setValue } = useForm<DonateFormValues>({
    defaultValues: {
      donationMethod: "bitcoin",
      walletAddress: bitcoinAddress,
    },
  });

  const [hasCopied, setHasCopied] = useState(false);

  const flickerClipboard = () => {
    navigator.clipboard.writeText(watch("walletAddress"));
    setHasCopied(true);
  };

  const selectedMethod = watch("donationMethod");

  useEffect(() => {
    if (hasCopied) setHasCopied(false);
    setValue("walletAddress", CRYPTO_ADDRESSES[selectedMethod]);
  }, [selectedMethod, setValue]);

  const onSubmit = (data: DonateFormValues) => {
    console.log("Donate submitted", data);
  };

  return (
    <div className="w-full max-w-[700px] min-h-[400px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-8 lg:p-12">
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold text-[#1A4349] leading-tight">
          Donate Now
        </h2>
        <p className="text-sm sm:text-base text-[#555] mt-2 sm:mt-3 mb-4 sm:mb-6 leading-normal">
          Choose your preferred method below to make a secure donation
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <Controller
          name="donationMethod"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {DONATION_METHODS.map((method) => {
                const isSelected = field.value === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => field.onChange(method.id)}
                    className={`inline-flex items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-colors min-h-[44px] sm:min-h-[48px] flex-1 sm:flex-initial ${
                      isSelected
                        ? "bg-linear-to-r from-[#1A4349]  to-[#3B97A1] text-white shadow-sm"
                        : "bg-white border border-[#D1D5DB] text-[#333] hover:border-[#9CA3AF]"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border text-xs sm:text-sm font-bold ${method.iconBg}`}
                    >
                      {method.iconLetter}
                    </span>
                    <span className="whitespace-nowrap">{method.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        />

        <div className="space-y-2">
          <Label
            htmlFor="walletAddress"
            className="text-sm font-medium text-[#333]"
          >
            Wallet Address
          </Label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666] pointer-events-none" />
            <Controller
              name="walletAddress"
              control={control}
              render={({ field }) => (
                <Input
                  id="walletAddress"
                  type="text"
                  readOnly
                  placeholder="Wallet address"
                  className="px-10 rounded-lg cursor-pointer border border-[#D1D5DB] h-12 text-[#333] bg-[#F9FAFB]"
                  onClick={flickerClipboard}
                  {...field}
                />
              )}
            />

            {hasCopied ? (
              <CopyCheck
                onClick={() => setHasCopied(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none text-green-800"
              />
            ) : (
              <Copy
                onClick={() => setHasCopied(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666] pointer-events-none"
              />
            )}

            {/* {showClip && (
              <p className="absolute right-1 top-1/2 -translate-y-1/2 w-fit h-fit px-5 py-2 bg-white text-xs text-green-700 font-medium rounded-full shadow">
                Copied to Clipboard
              </p>
            )} */}
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#1A4349] py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#15353a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B97A1] focus-visible:ring-offset-2"
        >
          I have sent {methodLabel[selectedMethod]}
        </button>
      </form>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E5E7EB]">
        <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
          <span className="font-bold text-[#333]">Please Note:</span> All
          donations go directly to our official accounts. We do not ask for
          personal information.
        </p>
      </div>
    </div>
  );
};

const DONATION_HELP_ITEMS = [
  { number: 1, text: "Documenting Urhobo\nvocabulary and grammar" },
  { number: 2, text: "Creating educational\nmaterials for schools" },
  { number: 3, text: "Developing language\nlearning apps" },
  { number: 4, text: "Organizing cultural events\nand workshops" },
];

const HowYourDonationHelps = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A4349] leading-tight mb-8 sm:mb-10">
          How your donation helps:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {DONATION_HELP_ITEMS.map((item) => (
            <div
              key={item.number}
              className="bg-white rounded-xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6 sm:p-8 flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0E7D6] text-[#1A4349] font-bold text-lg mb-5 sm:mb-6">
                {item.number}
              </div>
              <p className="text-[#1A4349] font-normal text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Donate() {
  return (
    <main className="relative mb-10">
      <DonateHero />
      <HowYourDonationHelps />
      <JoinTheUrhoboWorld />
    </main>
  );
}
