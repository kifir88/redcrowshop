import { NextResponse } from "next/server";
import config from "@/config";

export async function GET() {

    try {

        // Check if the environment variable is loaded and has the key
        const pageId  = config.PAGES['popup_ad_1'];

        const res = await fetch(
            `https://admin.redcrow.kz/wp-json/wp/v2/posts/${pageId}?v=${new Date().getTime()}`,
            {
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                },
            }
        );

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status });
        }

        const data = await res.json();

        return NextResponse.json(data);
    }
    catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
