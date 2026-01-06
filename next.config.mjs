/** @type {import('next').NextConfig} */

const nextConfig = {


    allowedDevOrigins: ['localhost', '*.redcrow.kz'],

    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Эти модули есть только в Node.js, исключаем их из клиента
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                tls: false,
                net: false,
                dgram: false,
            };
        }
        return config;
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=86400, stale-while-revalidate',
                    },

                ],
            },
        ]
    },

    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            }
        ];
    },

    experimental: {
        workerThreads: false,
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.redcrow.kz',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'admin.redcrow.kz',
                port: '',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'dev.redcrow.kz',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'dev2.redcrow.kz',
                port: '',
                pathname: '/wp-content/uploads/**',
            },
        ],
    },

    eslint: {
        ignoreDuringBuilds: true,
    },

    env: {

    }
};

export default nextConfig;
