// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        domains: ['localhost', 'your-app.vercel.app'],
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