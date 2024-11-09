import {NextRequest, NextResponse} from "next/server";
import {robokassaIsValidCallbackRequest} from "@/libs/robokassa-rest-api";

export async function GET(req: NextRequest)
{
  const isValid = robokassaIsValidCallbackRequest(req);

  const params = {};

  // Loop through all search parameters
  req.nextUrl.searchParams.forEach((value, key) => {
    console.log('qq: ' + key + ' = ' + value);
  });

  console.log('All Query Parameters:', params);

  const invId = req.nextUrl.searchParams.get('InvId');

  if (isValid)
  {
    console.log("Valid result from Robokassa orderId:"+ invId);
  }
  else
  {
    console.log("Invalid result from Robokassa orderId:"+ invId);
  }

  return NextResponse.json({ invId });
}