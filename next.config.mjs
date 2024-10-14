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
};

export default nextConfig;