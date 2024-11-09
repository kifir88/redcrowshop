import {NextRequest, NextResponse} from "next/server";
import {robokassaIsValidCallbackRequest} from "@/libs/robokassa-rest-api";

export async function POST(req: NextRequest)
{
  const isValid = robokassaIsValidCallbackRequest(req);

  if (isValid)
  {
    console.log("Valid result from Robokassa orderId:");
  }
  else
  {
    console.log("Invalid result from Robokassa orderId:");
  }

  const body = await req.text(); // Parses the JSON body
  //const { InvId } = body; // Extract a specific parameter, e.g., InvId

  console.log(body);

  return NextResponse.json({ a: 'ok' });
}