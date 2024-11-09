import {NextRequest, NextResponse} from "next/server";
import {robokassaIsValidCallbackRequest} from "@/libs/robokassa-rest-api";

export async function POST(req: NextRequest)
{
  const isValid = robokassaIsValidCallbackRequest(req);

  if (isValid)
  {
    console.log("Valid result from Robokassa orderId:"+ InvId);
  }
  else
  {
    console.log("Invalid result from Robokassa orderId:"+ InvId);
  }

  const body = await req.body(); // Parses the JSON body
  //const { InvId } = body; // Extract a specific parameter, e.g., InvId

  console.log(body);

  return NextResponse.json({ a: 'ok' });
}