"use client";

import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 md:hidden">
        <Link href="/dashboard" className="flex cursor-pointer">
          <Image
            src="/guono-logo.svg"
            alt="Guọnọ logo"
            width={100}
            height={30}
            className="h-6 w-auto"
            priority
          />
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <Link href="/dashboard" className="flex cursor-pointer">
          <Image
            src="/guono-logo.svg"
            alt="Guọnọ logo"
            width={100}
            height={30}
            className="h-7 md:h-8 w-auto"
            priority
          />
        </Link>
      </div>
    </>
  );
}
