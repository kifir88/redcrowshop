import { NextRequest, NextResponse } from "next/server";
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);
const mailgunClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || "1e437a0e91d108be4a56f68211b6858f-d010bdaf-0269b9f1",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.orderId) {
      throw new Error("OrderId is required");
    }

    const mailgunMessageData = {
      from: "Excited User <mailgun@sandboxbec10238dca94e57a23b6427b0975712.mailgun.org>",
      to: ["asgardpavlov@gmail.com"],
      subject: `RedCrow Успешная Оплата - Заказ #${body.orderId}`,
      text: "Hello here is a file in the attachment"
    }

    const mailgunResponse = await mailgunClient.messages.create("sandbox-123.mailgun.org", mailgunMessageData)

    return NextResponse.json(mailgunResponse);
  } catch (error) {
    console.error("Sending email error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export const runtime = 'nodejs'