import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep these out of the bundle so Node loads them directly (needed for PDF reading)
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist', '@napi-rs/canvas'],
};

export default nextConfig;
