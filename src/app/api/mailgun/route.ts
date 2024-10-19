import { NextRequest, NextResponse } from "next/server";
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import {MailgunMessageData} from "mailgun.js/Types/Messages";

const mailgun = new Mailgun(FormData);
const mailgunClient = mailgun.client({
  url: "https://api.eu.mailgun.net",
  username: 'api',
  key: process.env.MAILGUN_API_KEY || "9085566ba3ba48dbf8024860b652aba3-d010bdaf-9b12ac21",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.to
      || !body?.subject
      || !body?.text
    ) {
      throw new Error("В теле запроса не хватает базовых параметров.");
    }
    // if (
    //   !(body?.text && body?.html)
    // ) {
    //   throw new Error("Параметры html или text обязательны.");
    // }

    const mailgunMessageData: MailgunMessageData = {
      from: "RedCrow KZ <mailgun@a-au.com>",
      to: [body.to],
      subject: body.subject,
      text: body.text || "",
    }

    if (body?.html) {
      mailgunMessageData.html = body.html;
    }

    const mailgunResponse = await mailgunClient.messages.create(
      // TODO extract to env variables
      "a-au.com",
      mailgunMessageData
    )

    return NextResponse.json(mailgunResponse);
  } catch (error) {
    console.error("Ошибка отправки имейла через MailGun:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export const runtime = 'nodejs'