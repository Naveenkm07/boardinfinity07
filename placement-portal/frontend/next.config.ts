/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for catching bugs early
    reactStrictMode: true,

    // Environment variables exposed to the client (NEXT_PUBLIC_ prefix)
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },

    // Image optimization (add external domains if needed)
    images: {
        domains: [],
    },
};

export default nextConfig;
