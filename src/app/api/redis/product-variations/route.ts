import { NextResponse } from "next/server";
import redis from "@/libs/redis";
import {wooCommerceApiInstance, wooCommerceCustomV1ApiInstance} from "@/libs/woocommerce-rest-api";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";
import type {AxiosResponse} from "axios";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

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

    const cacheKey = `product-variations:${JSON.stringify(params)}`;

    // 1️⃣ Try Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        return NextResponse.json(JSON.parse(cached));
    }

    // -----------------------------------------------------------------
    const resp = await wooCommerceApiInstance.get(`products/${params['productId']}/variations`, params)

    const data = resp.data

    // 3️⃣ Save in Redis
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL_SECONDS);

    return NextResponse.json(data);
}