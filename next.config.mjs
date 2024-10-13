/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["kaizen-chi.vercel.app", "https://www.pinterest.com/"], // Add any domains you use for hosting images.
        formats: ["image/avif", "image/webp"],
    },
};

export default nextConfig;