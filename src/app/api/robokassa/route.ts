import { NextRequest, NextResponse } from "next/server";
import {Order} from "@/types/woo-commerce/order";
const robokassa = require('node-robokassa');

// merchantLogin: "thedogrex",
//   hashingAlgorithm: "md5",
//   password1: "l33vZ4EPpCDHVOfcI00t",
//   password2: "PfvLtWkL0s3H8w8VS2Ex",
//   // TODO true only for dev mode
//   testMode: true,
//   testPassword1: "l33vZ4EPpCDHVOfcI00t",
//   testPassword2: "PfvLtWkL0s3H8w8VS2Ex",
//   resultUrlRequestMethod: "POST", // !ONLY ACCEPTED METHOD FOR NOW

const robokassaHelper = new robokassa.RobokassaHelper({
  // REQUIRED OPTIONS:
  merchantLogin: 'redcrowshop',
  hashingAlgorithm: 'md5',
  password1: 'thBxjea111OWTIu7Y7kp',
  password2: 'ZO5DfOO2tTYF4cB78IUV',

  // OPTIONAL CONFIGURATION
  testMode: false, // Whether to use test mode globally
  testPassword1: "MJ1hL68FHYwLJO8CrJ5D",
  testPassword2: "ejjTYhz7Dm4IDj99Pj5H",
  resultUrlRequestMethod: 'POST' // HTTP request method selected for "ResultURL" requests
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order }: { order: Order } = body;

    console.log(order, "order")

    // Required parameters.
    const outSum = 100.17;
    const invDesc = 'Custom transaction description message';

    // Optional options.
    const options = {
      invId: 100500, // Your custom order ID
      email: 'email@example.com', // E-Mail of the paying user
      outSumCurrency: 'USD', // Transaction currency
      isTest: true, // Whether to use test mode for this specific transaction
      userData: { // You could pass any additional data, which will be returned to you later on
        productId: '1337',
        username: 'testuser'
      }
    };

    const paymentUrl = robokassaHelper.generatePaymentUrl(outSum, invDesc);

    return NextResponse.json({ paymentUrl: paymentUrl });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 });
  }
}

export const runtime = 'nodejs'
// 'nodejs' | 'edge'