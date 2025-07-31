/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for Docker
    output: 'standalone',

    // Disable server-side image optimization in Docker
    images: {
        unoptimized: true,
    },

    // Enable experimental features
    experimental: {
        // Enable app directory
        appDir: true,
    },

    // Environment variables
    env: {
        PORT_API: process.env.PORT_API || 'http://localhost:8000',
    },

    // Webpack configuration
    webpack: (config, { isServer }) => {
        // Add fallbacks for Node.js modules
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }

        return config;
    },

    // Headers for security
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },

    // Redirects
    async redirects() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.PORT_API || 'http://localhost:8000'}/:path*`,
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig; 