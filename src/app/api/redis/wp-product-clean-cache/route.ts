import { NextResponse } from "next/server";
import redis from "@/libs/redis";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product_id, variation_id, parent_id, key } = body;

        // simple authentication
        if (key !== "changemykeypass") {
            return NextResponse.json({ success: false, error: "bad auth" }, { status: 401 });
        }

        console.log("🔹 Received update:", body);

        const removedKeys: string[] = [];
        let cursor = "0";

        // Convert IDs to strings to compare safely
        const idsToMatch = [product_id, variation_id, parent_id]
            .filter(Boolean)
            .map((id) => String(id));

        // Scan through Redis in batches (non-blocking)
        do {
            const [nextCursor, keys] = await redis.scan(cursor, "MATCH",
                "*", "COUNT", 100);

            cursor = nextCursor;

            for (const redisKey of keys) {
                if (idsToMatch.some((id) => redisKey.includes(id))) {
                    await redis.del(redisKey);
                    removedKeys.push(redisKey);
                }
            }
        } while (cursor !== "0");

        console.log(`🗑️ Removed ${removedKeys.length} keys`);
        if (removedKeys.length > 0) console.log(removedKeys);

        return NextResponse.json({
            success: true
        });
    } catch (err: any) {
        console.error("Redis clear error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}