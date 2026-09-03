"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconLoaderQuarter } from "@tabler/icons-react";
import { logoutHandler } from "@/features/auth";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    logoutHandler();
    router.push("/home");
  }, [router]);
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center py-8 lg:px-8 md:px-4 px-0">
      <IconLoaderQuarter
        size={48}
        className="animate-spin text-foreground-50"
      />
    </div>
  );
};

export default LogoutPage;
