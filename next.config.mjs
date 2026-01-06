/** @type {import('next').NextConfig} */

import * as fs from 'fs';
import * as path from 'path';

export function checkIfFileExistsSync(filename) {
    const filePath = path.join(process.cwd(), filename);

    return fs.existsSync(filePath);
}

let base_url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.redcrow.kz';

let WP_URL = 'https://admin.redcrow.kz';
let REDIS_HOST = "redcrow.kz";
if (checkIfFileExistsSync('staging.pid')) {
    base_url = 'https://dev.redcrow.kz';
    WP_URL = 'https://dev2.redcrow.kz/';
    REDIS_HOST = "localhost";
}

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
                    // {
                    //     key: 'Cache-Control',
                    //     value: 'public, no-store, no-cache, must-revalidate, proxy-revalidate',
                    // },

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
        // TODO localhost only for development
        // NEXTAUTH_URL: "http://localhost:3000",
        NEXTAUTH_URL: "https://www.redcrow.kz/",
        YOOKASSA_SHOP_ID: "261657",
        YOOKASSA_SECRET_KEY: "live_3x_AZuQKS9FGsDOmdG-1R757d_dd-eIOlhTbE92ljwM",
        NEXT_PUBLIC_STRAPI_API_URL: "https://api.redcrow.kz",
        STRAPI_API_URL: "https://api.redcrow.kz",
        STRAPI_API_KEY: "dc804e7aaf256c5744ae633d5b5bb95e51ffdee9d75836a0eda42a6262c371ad919a68ca7af76486104e78dac7a21b16770d46d21e9ef599d86b809d5d498c99f92a4dcfee086855001f5e6bc4f85e171e480c4748825fd2f2aa9b96f181110bc9281b7408f829504586e6a414f54985d7f470a9bf7a05acf293bbf3fcb8c024",
        MAILGUN_API_KEY: "9085566ba3ba48dbf8024860b652aba3-d010bdaf-9b12ac21",

        REDIS_HOST: REDIS_HOST || "redcrow.kz",
        REDIS_PORT: "6379",
        REDIS_PASSWORD: "myredispassword@#A!",

        NEXT_PUBLIC_BASE_URL: base_url,
        NEXT_PUBLIC_WP_URL: WP_URL,

    }
};

export default nextConfig;
