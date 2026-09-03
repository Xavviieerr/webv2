import { URLS } from "@/constants/urls";
import type { MetadataRoute } from "next";

export const revalidate = 86400;

const { base } = URLS.INTERNALS;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
  ];

  return [...staticPages];
}
