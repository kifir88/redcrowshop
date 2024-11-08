// @ts-ignore
import RoboGate from "robokassa-gate";
import {Order} from "@/types/woo-commerce/order";

const robokassaApiInstance = new RoboGate({
  // REQUIRED OPTIONS:
  merchantLogin: 'redcrowshop',
  hashingAlgorithm: 'md5',
  password1: 'HYeX5Kh8yC1HdP63sfZN',
  password2: 'T0Wi5pt4M51wkfWLMnUe',

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