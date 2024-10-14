// @ts-ignore
import RoboGate from "robokassa-gate";
import {Order} from "@/types/woo-commerce/order";

const robokassaApiInstance = new RoboGate({
  merchantLogin: "redcrowshop",
  hashingAlgorithm: "md5",
  password1: 'rjWWXl1u7kmSKaM37u8L',
  password2: 'TwVeW9V5BGyzjGP458Vt',
  // TODO true only for dev mode
  testMode: false,
  testPassword1: "s726NqXcByj0Sltu2rza",
  testPassword2: "Qc8d7njELqrwZ936jqRg",
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