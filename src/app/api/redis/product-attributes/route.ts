import { NextResponse } from "next/server";
import redis from "@/libs/redis";
import { wooCommerceCustomV1ApiInstance } from "@/libs/woocommerce-rest-api";

const CACHE_TTL_SECONDS = 60 * 5; // 5 min

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

    const cacheKey = `product-attributes:${JSON.stringify(params)}`;

    // 1️⃣ Try Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        return NextResponse.json(JSON.parse(cached));
    }

    // 2️⃣ Fetch from WooCommerce
    const response = await wooCommerceCustomV1ApiInstance.get("product-attributes", params);
    const data = response.data


    // 3️⃣ Save in Redis
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL_SECONDS);

    return NextResponse.json(data);
}