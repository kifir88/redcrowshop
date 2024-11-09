import {NextRequest, NextResponse} from "next/server";
import {robokassaIsValidCallbackRequest} from "@/libs/robokassa-rest-api";

export async function POST(req: NextRequest)
{
  const body = await req.text(); // Parses the JSON body

  const params = new URLSearchParams(body); // Parse the URL-encoded data
  const data = Object.fromEntries(params.entries());

  const invId = params.get("InvId"); // Get specific parameters
  const outSum = params.get("OutSum");

  const isValid = robokassaIsValidCallbackRequest(data);

  if (isValid)
  {
    console.log("Valid result from Robokassa orderId:");
  }
  else
  {
    console.log("Invalid result from Robokassa orderId:");
  }

  console.log("InvId:", invId);
  console.log("OutSum:", outSum);

  return NextResponse.json({ a: 'ok' });
}