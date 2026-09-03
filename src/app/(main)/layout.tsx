import { ReactNode } from "react";
import "../global.css";
import { Metadata } from "next";
import { URLS } from "@/constants/urls";
import NewSubHeading from "@/components/newlayout/newsubheading";
import Footer from "@/components/layouts/Footer";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";

import NewHeader from "@/components/newlayout/newHeader";
const {
  INTERNALS: { base },
} = URLS;

const title = "Guọnọ - Learn Definitions Fast";
const description = "Find definitions and knowledge instantly.";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  verification: {
    google: "gAWQdbLeSvXcD471mhHAgJCw7J9lMmFBCCbiLVCIn18",
  },
  title: {
    default: title,
    template: "%s - Learn Definitions Fast",
  },
  description,

  openGraph: {
    title,
    description,
    url: base,
    siteName: "Guọnọ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    site: "@guono_dict",
  },
};

const plusSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-sans",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  //  style={{ fontFamily: "system-ui" }}
  return (
    <div className={`bg-backg ${plusSans.className}`}>
      <div className="bg-backg fixed top-0 left-0 right-0 z-50">
        {/* <NewSubHeading /> */}
        <NewHeader />
      </div>
      <div className="mt-20">{children}</div>
      <Footer />
    </div>
  );
}
