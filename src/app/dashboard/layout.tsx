import { ReactNode } from "react";
import "../global.css";
import { Metadata } from "next";
import { URLS } from "@/constants/urls";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/shell/components/AppSidebar";
import { DashboardHeader } from "@/features/dashboard/shell/components/DashboardHeader";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  const topBannersHeight = "65px";
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                    [data-slot="sidebar-container"] {
                        top: ${topBannersHeight} !important;
                        height: calc(100vh - ${topBannersHeight}) !important;
                    }
                `,
        }}
      />
      <div className="font-sf min-h-screen bg-backg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-[#0E808D] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
              "--top-banners-height": topBannersHeight,
            } as React.CSSProperties
          }
          className="bg-backg p-0 h-svh"
        >
          <DashboardHeader />

          <AppSidebar variant="inset" />
          <SidebarInset className="pt-(--top-banners-height) bg-backg overflow-hidden">
            <div className="flex flex-1 flex-col min-h-[calc(100vh-var(--top-banners-height))] overflow-y-auto custom-scrollbar">
              <div id="main-content" className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6 relative">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
