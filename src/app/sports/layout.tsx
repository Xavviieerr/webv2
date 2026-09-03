import { ReactNode } from "react";
import "../global.css";
import { Metadata } from "next";
import { URLS } from "@/constants/urls";
import { DM_Sans } from "next/font/google";
import { SearchNav as Navbar } from "@/features/search/components/nav";


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


const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-dm-sans",
});

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className={`${dmSans.className} bg-[#F2FEFF]`}>
            
            <Navbar />
            <div className="px-6 py-4">
                {children}
            </div>
        </div>
    );
}