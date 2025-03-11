import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import { MailgunMessageData } from "mailgun.js/Types/Messages";

const mailgun = new Mailgun(FormData);
const mailgunClient = mailgun.client({
  url: "https://api.eu.mailgun.net",
  username: "api",
  key: process.env.MAILGUN_API_KEY || "9085566ba3ba48dbf8024860b652aba3-d010bdaf-9b12ac21",
});

// In-memory cache to store the last sent timestamp per emailw
const emailCache = new Map<string, number>();
const EMAIL_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.to || !body?.subject || !body?.text) {
      throw new Error("В теле запроса не хватает базовых параметров.");
    }

    const currentTime = Date.now();
    const lastSentTime = emailCache.get(body.to);
    /*if (lastSentTime && currentTime - lastSentTime < EMAIL_COOLDOWN_MS) {
      return NextResponse.json(
          { message: "Email was sent less than 3 minutes ago. Ignoring request." },
          { status: 429 }
      );
    }*/

    const mailgunMessageData: MailgunMessageData = {
      from: "REDCROW KZ <mailgun@redcrow.kz>",
      to: [body.to],
      subject: body.subject,
      text: body.text || "",
      "o:time-to-live": "2m",
    };

    if (body?.html) {
      mailgunMessageData.html = body.html;
    }

    const mailgunResponse = await mailgunClient.messages.create(
        "redcrow.kz",
        mailgunMessageData
    );

    // Update cache with the latest timestamp
    emailCache.set(body.to, currentTime);

    return NextResponse.json(mailgunResponse);

  } catch (error) {
    console.error("Ошибка отправки имейла через MailGun:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export const runtime = "nodejs";