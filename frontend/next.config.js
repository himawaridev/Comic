/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.truyenhoan.com",
            },
        ],
    },
};

export default nextConfig;
