/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'kaizen-chi.vercel.app',
            },
            {
                protocol: 'https',
                hostname: 'www.pinterest.com',
            },
        ],
        formats: ["image/avif", "image/webp"],
    },
    experimental: {
        disableOptimizedLoading: false,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
    headers: async() => {
        return [{
            source: '/:path*',
            headers: [{
                key: 'Permissions-Policy',
                value: 'popup=*'
            }],
        }, ];
    },
};

export default nextConfig;