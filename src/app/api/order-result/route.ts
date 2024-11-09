import {NextRequest, NextResponse} from "next/server";
import {robokassaIsValidCallbackRequest} from "@/libs/robokassa-rest-api";

export async function POST(req: NextRequest)
{
  const isValid = robokassaIsValidCallbackRequest(req);

  const body = await req.json(); // Parses the JSON body
  const { InvId } = body; // Extract a specific parameter, e.g., InvId

  if (isValid)
  {
    console.log("Valid result from Robokassa orderId:"+ InvId);
  }
  else
  {
    console.log("Invalid result from Robokassa orderId:"+ InvId);
  }

  return NextResponse.json({ InvId });
}