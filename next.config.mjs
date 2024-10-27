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
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
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
            headers: [
                {
                    key: 'Permissions-Policy',
                    value: 'popup=*'
                },
                {
                    key: 'Access-Control-Allow-Origin',
                    value: '*'
                },
                {
                    key: 'Access-Control-Allow-Methods',
                    value: 'GET, POST, PUT, DELETE, OPTIONS'
                },
                {
                    key: 'Access-Control-Allow-Headers',
                    value: 'Content-Type, Authorization'
                }
            ],
        }];
    },
};

export default nextConfig;