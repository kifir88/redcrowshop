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

        await redis.flushall();

        return NextResponse.json({
            success: true
        });
    } catch (err: any) {
        console.error("Redis clear error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}