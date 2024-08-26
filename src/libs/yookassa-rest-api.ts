import type { NextApiRequest, NextApiResponse } from "next";
import { ICreatePayment, YooCheckout } from "@a2seven/yoo-checkout";
import { v4 as uuidv4 } from "uuid";

const yookassaApiInstance = new YooCheckout({
  // shopId: "261657",
  shopId: "446054",
  // secretKey: "live_3x_AZuQKS9FGsDOmdG-1R757d_dd-eIOlhTbE92ljwM",
  secretKey: "test_N7eB5Ia5aKOzj0t0ESbg7ZDUPPaTdjedm3p_vzUZVaA\n",
  debug: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { order } = req.body;
      const paymentId = uuidv4();

      // Construct payment payload
      const yookassaCreatePayload: ICreatePayment = {
        amount: {
          value: order.total,
          currency: order.currency,
        },
        payment_method_data: {
          type: "bank_card",
        },
        confirmation: {
          type: "redirect",
          return_url: `${process.env.NEXTAUTH_URL}/orders/${order.id}?paymentOption=uKassa&paymentId=${paymentId}`,
        },
        capture: false,
      };

      // Create payment using YooKassa API
      const payment = await yookassaApiInstance.createPayment(yookassaCreatePayload, paymentId);

      // Send success response with payment details
      res.status(200).json({ payment });
    } catch (error) {
      // Handle any errors from YooKassa or the API
      console.error("Payment creation error:", error);
      res.status(500).json({ error: "Payment creation failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
