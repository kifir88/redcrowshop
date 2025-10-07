import { NextResponse } from "next/server";
import redis from "@/libs/redis";
import { wooCommerceApiInstance } from "@/libs/woocommerce-rest-api";

const CACHE_TTL_SECONDS = 60 * 600; // 600 min

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const params: Record<string, any> = {};

    for (const [key, value] of searchParams.entries()) {
        if (key.endsWith("[]")) {
            const cleanKey = key.replace("[]", "");
            params[cleanKey] = params[cleanKey] || [];
            params[cleanKey].push(value);
        } else {
            try {
                params[key] = JSON.parse(value);
            } catch {
                params[key] = value;
            }
        }
    }

    const cacheKey = `products:${JSON.stringify(params)}`;

    // 1️⃣ Try Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        return NextResponse.json(JSON.parse(cached));
    }

    const cacheBuster = { _timestamp: new Date().getTime() };
    const defaultParams = { ...params, status: 'publish', ...cacheBuster };

    // 2️⃣ Fetch from WooCommerce
    const response = await wooCommerceApiInstance.get("products?"+new Date().getTime(), defaultParams);
    const data = response.data

    const totalPages = response.headers["x-wp-totalpages"]

    const saveData = {totalPages: totalPages, data: data}

    // 3️⃣ Save in Redis
    await redis.set(cacheKey, JSON.stringify(saveData), "EX", CACHE_TTL_SECONDS);

    return NextResponse.json(saveData);
}