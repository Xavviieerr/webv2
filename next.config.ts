const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "media.api-sports.io",
      "res.cloudinary.com",
      "blogger.googleusercontent.com",
      "sarauta.net",
      "www.nairaland.com",
      "rexclarkeadventures.com",
      "nigeriannewsdirect.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Note: HMR ping errors are a known issue with Next.js 15 + Turbopack
  // These are harmless warnings and don't affect functionality
  // They can be safely ignored or will be fixed in future Next.js updates
};

export default nextConfig;
