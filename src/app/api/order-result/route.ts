import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body, "body")
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({error: "Payment creation failed"}, {status: 500});
  }
}