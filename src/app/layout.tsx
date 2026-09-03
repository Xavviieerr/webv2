import { ReactNode } from "react";
import "./global.css";
import { Metadata } from "next";
import { URLS } from "@/constants/urls";
import { Providers } from "@/utils/app-provider";
import AuthGuard from "@/features/auth/components/AuthGuard";
import { Plus_Jakarta_Sans } from "next/font/google";

const {
  INTERNALS: { base },
} = URLS;

const title = "Guọnọ - Learn Definitions Fast";
const description = "Find definitions and knowledge instantly.";

const plusSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-sans",
});

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${plusSans.variable} font-sf antialiased bg-backg min-h-svh`}
      >
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
