/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            },
        ];
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
        ],
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
    }
};

export default nextConfig;
