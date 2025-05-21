import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    output: 'export', // Use static export for Cloudflare Pages
    trailingSlash: true, // Optionally, set trailingSlash to true for better static hosting compatibility
};

export default nextConfig;
