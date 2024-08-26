/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // TODO localhost only for development
        // NEXTAUTH_URL: "http://localhost:3000",
        NEXTAUTH_URL: "https://www.redcrow.kz/",
        YOOKASSA_SHOP_ID: "261657",
        YOOKASSA_SECRET_KEY: "live_3x_AZuQKS9FGsDOmdG-1R757d_dd-eIOlhTbE92ljwM",
    }
};

export default nextConfig;
