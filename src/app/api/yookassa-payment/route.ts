import { NextRequest, NextResponse } from "next/server";
import { ICreatePayment, YooCheckout } from "@a2seven/yoo-checkout";
import { v4 as uuidv4 } from "uuid";

// Initialize YooKassa instance
const yookassaApiInstance = new YooCheckout({
  // TODO test credits only for DEV mode
  // shopId: "446054",
  // secretKey: "test_N7eB5Ia5aKOzj0t0ESbg7ZDUPPaTdjedm3p_vzUZVaA",
  shopId: process.env.YOOKASSA_SHOP_ID as string,
  secretKey: process.env.YOOKASSA_SECRET_KEY as string,
  // debug: true,
});

export async function GET(req: NextRequest) {
  return NextResponse.json({
    hello: "world"
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order } = body;
    const paymentId = uuidv4();

    // Construct payment payload
    const yookassaCreatePayload: ICreatePayment = {
      amount: {
        value: order.total,
        // TODO for tests only RUB
        // currency: "RUB",
        currency: order.currency,
      },
      payment_method_data: {
        type: "bank_card",
      },
      confirmation: {
        type: "redirect",
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}?paymentOption=uKassa&paymentId=${paymentId}`,
      },
      capture: false,
    };

    // Create payment using YooKassa API
    const payment = await yookassaApiInstance.createPayment(yookassaCreatePayload, paymentId);

    // Send success response with payment details
    return NextResponse.json({ payment });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 });
  }
}

export const runtime = 'nodejs'
// 'nodejs' | 'edge'