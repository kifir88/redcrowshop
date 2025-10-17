import { NextResponse } from "next/server";
import redis from "@/libs/redis";
import {fetchProductCategories, fetchProducts} from "@/libs/woocommerce-rest-api";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product_id, variation_id, parent_id, key } = body;

        // simple authentication
        if (key !== "changemykeypass") {
            return NextResponse.json({ success: false, error: "bad auth" }, { status: 401 });
        }

        await redis.flushall();

        runPrewarmCategories().catch(console.error);

        return NextResponse.json({
            success: true
        });
    } catch (err: any) {
        console.error("Redis clear error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

async function runPrewarmCategories() {

    try {
        // 1️⃣ Fetch all categories except 378
        const productCategoriesData = await fetchProductCategories({
            exclude: [378],
        });

        const categories = productCategoriesData?.data || [];

        // 2️⃣ Loop through each category
        for (const category of categories) {
            const categoryId = category.id;

            // 3️⃣ Fetch first page of products for this category
            const productsResponse = await fetchProducts({
                category: categoryId,
                order: undefined,
                orderby: undefined,
                page: undefined,
                per_page: 12,
            });

            console.log(
                `✅ Prewarmed category "${category.name}" (${categoryId}) — ${productsResponse?.data?.length || 0} products loaded`
            );

            // Optional small delay between calls to avoid server overload
            await new Promise((res) => setTimeout(res, 500));
        }

        console.log("🎉 Prewarm completed for all categories.");
    } catch (err) {
        console.error("❌ Prewarm failed:", err);
    }
}