"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/types/hooks";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export function WelcomeBanner() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation("common");
  const userFirstName = user?.firstName ?? t("welcome");

  return (
    <div className="w-full rounded-2xl bg-[#D4E8EA] p-6 sm:p-8 lg:p-10 overflow-hidden relative">
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-auto h-full items-center justify-end">
        <div className="relative h-full w-[400px] lg:w-[450px] xl:w-[500px]">
          <Image
            src="/illustration-2.svg"
            alt="Welcome Banner Background"
            fill
            className="object-contain object-right"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 relative z-10">
        <div className="flex-1 flex flex-col gap-4 sm:gap-5">
          <h1 className="text-[24px] sm:text-2xl lg:text-[24px] capitalize font-medium text-[#111111]">
            {userFirstName} 👋🏽
          </h1>
          <div className="flex flex-col gap-1 sm:gap-2">
            <h2 className="text-[28px] font-semibold text-[#291E0A]">
              {t("welcomeBack")},
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-[16px] text-[#11111] font-normal leading-relaxed max-w-lg">
            {t("welcomeBackDescription")}
          </p>
          <Button
            onClick={() => {
              router.push("/search");
            }}
            className="inline-flex items-center px-4 py-6 justify-center min-w-[200px] min-h-[52px] rounded-lg bg-[#1A4349] text-white font-medium uppercase text-sm sm:text-base hover:bg-[#1A4349]/90 transition-colors w-fit mt-2"
          >
            {t("guonoSearch")}
          </Button>
        </div>
      </div>
    </div>
  );
}
