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

    const cacheKey = `product-attribute-terms:${JSON.stringify(params)}`;

    // 1️⃣ Try Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        return NextResponse.json(JSON.parse(cached));
    }

    // -----------------------------------------------------------------
    let allTerms: ProductAttributeTerm[] = [];
    let page = 1;
    let totalPages = 1;

    do {
        const response: AxiosResponse<ProductAttributeTerm[]> = await wooCommerceApiInstance.get(
            `products/attributes/${params['attributeId']}/terms?per_page=100&page=${page}`
        );

        allTerms = allTerms.concat(response.data);

        // WooCommerce sends total pages in headers
        totalPages = parseInt(response.headers["x-wp-totalpages"] || "1", 10);
        page++;
    } while (page <= totalPages);

    const data = allTerms;


    // 3️⃣ Save in Redis
    await redis.set(cacheKey, JSON.stringify(data), "EX", CACHE_TTL_SECONDS);

    return NextResponse.json(data);
}