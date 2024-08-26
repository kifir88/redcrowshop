// @ts-ignore
import RoboGate from "robokassa-gate";
import {Order} from "@/types/woo-commerce/order";

const robokassaApiInstance = new RoboGate({
  merchantLogin: "Redcrow.kz",
  hashingAlgorithm: "md5",
  password1: "eXlS2C9xqg22rtDKZ0ov",
  password2: "D7hIcKRP11MptDq8XDq3",
  // TODO true only for dev mode
  testMode: true,
  testPassword1: "e222",
  testPassword2: "222",
  resultUrlRequestMethod: "GET", // !ONLY ACCEPTED METHOD FOR NOW
});


export const robokassaGeneratePaymentURL = (order: Order): string => {
  const items = order.line_items.map(li => ({
    product_id: li.product_id,
    variation_id: li.variation_id,
    quantity: li.quantity,
    price: li.price,
    total: li.total,
    subtotal: li.subtotal,
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