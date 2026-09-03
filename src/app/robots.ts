import { URLS } from "@/constants/urls";
import type { MetadataRoute } from "next";

const {
  INTERNALS: { base },
} = URLS;

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_ENV != "staging") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
        {
          userAgent: "Twitterbot",
          allow: "/",
        },
        {
          userAgent: "facebookexternalhit",
          allow: "/",
        },
        {
          userAgent: "LinkedInBot",
          allow: "/",
        },
      ],
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*", "/administrator", "/administrator/*"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
