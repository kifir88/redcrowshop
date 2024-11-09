// @ts-ignore
import RoboGate from "robokassa-gate";
import {Order} from "@/types/woo-commerce/order";
import {NextRequest, NextResponse} from "next/server";

const robokassaApiInstance = new RoboGate({
  // REQUIRED OPTIONS:
  merchantLogin: 'redcrowshop',
  hashingAlgorithm: 'md5',
  password1: 'ZQ4B6UJqQ8w6hQhyx0tw',
  password2: 'c0JXAQwvU7f0MH8nQ9er',

  // OPTIONAL CONFIGURATION
  testMode: true, // Whether to use test mode globally
  testPassword1: "MJ1hL68FHYwLJO8CrJ5D",
  testPassword2: "ejjTYhz7Dm4IDj99Pj5H",
  resultUrlRequestMethod: "POST", // !ONLY ACCEPTED METHOD FOR NOW
});


export const robokassaGeneratePaymentURL = (order: Order): string => {
  const items = order.line_items.map(li => ({
    // product_id: li.product_id,
    // variation_id: li.variation_id,
    name: li.name,
    quantity: li.quantity,
    price: li.price,
    // total: li.total,
    // subtotal: li.subtotal,
  }))

  return robokassaApiInstance.generatePaymentURL({
    invId: order.id,
    invSumm: order.total,
    invDescr: `Оплата Заказа на RedCrow.kz / Заказ: ${order.id}`,
    email: order.billing.email,
    items: items,
    invSummCurrency: "KZT",
  })
}

export const robokassaIsValidCallbackRequest = (req: NextRequest) : boolean =>
{
   const { validated, details } = robokassaApiInstance.validateResult(req);
   return validated === true;
}