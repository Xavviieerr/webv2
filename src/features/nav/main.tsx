import Link from "next/link";
import React from "react";
import { LanguageSwitcher } from "../shared";
import Image from "next/image";

const BaseNav = () => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-between w-full py-3 md:px-10 px-5 font-plus-sans shadow-sm z-50 bg-backg">
      {/* <Link
        href={"/dashboard"}
        className="bg-primary text-white font-medium primary-btn rounded-full"
      >
        Dashboard
      </Link> */}

      <Link href="/" className="flex cursor-pointer">
        <Image
          src="/guono-logo.svg"
          alt="Guọnọ logo"
          width={100}
          height={28}
          className=""
        />
      </Link>

      <div className="flex gap-4 items-center">
        {[
          { label: "dictionary", url: "/dashboard/dictionary" },
          { label: "names", url: "/dashboard/names" },
          { label: "figures", url: "/dashboard/figures" },
        ].map((item) => (
          <Link
            href={item.url}
            key={item.label}
            className="text-base font-semibold text-primary/80 hover:text-primary capitalize transition-all duration-200"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-end">
        <LanguageSwitcher />
        <div className="bg-gray-600/80 rounded-full h-12 w-12" />
      </div>
    </div>
  );
};

export default BaseNav;
