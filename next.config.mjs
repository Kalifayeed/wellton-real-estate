/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained production server output (used by the Docker deploy).
  output: 'standalone',
  images: {
    // Demo placeholders are local SVG files. Allow SVG so Next Image can
    // serve them (real uploaded photos are raster and unaffected).
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Local/uploaded images are served from same origin, nothing needed here.
    ],
  },
  // Server actions must know about the upload body size for property media.
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
};

export default nextConfig;
