/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["sequelize", "pg", "pg-hstore"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.truyenhoan.com",
            },
        ],
    },
};

module.exports = nextConfig;
