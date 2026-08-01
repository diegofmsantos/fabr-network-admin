// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'https', hostname: 'your-app.vercel.app' },
            { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
        ],
    },
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve?.fallback,
                fs: false,
                path: false,
            },
        }
        return config
    },
}

export default nextConfig