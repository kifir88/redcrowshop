import {NextRequest, NextResponse} from "next/server";
import {robokassaIsValidCallbackRequest} from "@/libs/robokassa-rest-api";
import {fetchOrder, updateOrder} from "@/libs/woocommerce-rest-api";
import {formatPriceToKZT, formatPriceToLocale} from "@/libs/helper-functions";
import axios from "axios";
import {Order} from "@/types/woo-commerce/order";
import {Callback} from "@/libs/gate";

export async function POST(req: NextRequest)
{

   const params = await req.json(); // Parses the JSON body

    const { searchParams } = new URL(req.url);
    const orderToken = searchParams.get("order_token") ?? "";

  var callback = new Callback(params);

  if(callback?.isValid() === true)
  {
      console.log("valid payment")

      if(callback?.isPaymentSuccess())
      {
          const orderId = callback?.getPaymentId() ?? "none";

          console.log("order id:");
          console.log(orderId);

          const orderData = await fetchOrder(orderId, orderToken)
          const order = orderData!.data;

          const orderUpdatePayload: Partial<Order> = {
              payment_method: "PSP",
              transaction_id: orderId,
              set_paid: true,
              customer_note: "[ ЗАКАЗ ОПЛАЧЕН ]",
              status: "processing",
          }

          updateOrder(orderId, orderUpdatePayload)

          try {
              const emailContent = generateOrderEmailText(order);

              const emailPayload = {
                  to: orderData!.data.billing.email,
                  subject: `REDCROW Успешная Оплата - Заказ #${orderId}\n`,
                  text: emailContent
                  //   (
                  //   `
                  //   <div>
                  //     <p>
                  //
                  //     </p>
                  //     <h4>${productList}</h4>
                  //     <p>
                  //        На сумму:
                  //     </p>
                  //     <h4>
                  //      ${formatPriceToKZT(orderData.data.total)}
                  //     </h4>
                  //   </div>
                  //   `
                  // )
              }
              await axios.post(
                  "/api/mailgun",
                  emailPayload,
                  {
                      // TODO extract base url to env variable
                      baseURL: "https://www.redcrow.kz/",
                      headers: {
                          "Content-type": "application/json"
                      }
                  }
              )
          } catch(e){

          }
      }
      else
      {
          console.log("not successful payment, signature is ok");
          return NextResponse.json({ a: 'payment not succesful' });

      }
  } else {
      console.log("invalid callback signature");
      return NextResponse.json({ a: 'wrong signature' });
  }



  return NextResponse.json({ a: 'ok' });
}

function generateOrderEmailText(order: Order): string {
  const { billing, shipping, line_items, total } = order;

  return `
Подтверждение заказа

Детали оплаты:
Имя: ${billing.first_name} ${billing.last_name}
Электронная почта: ${billing.email}
Телефон: ${billing.phone}

Адрес для выставления счета:
${billing.address_1}
${billing.address_2 ? billing.address_2 + '\n' : ''}${billing.city}, ${billing.state} ${billing.postcode}
${billing.country}

Адрес доставки:
${shipping.address_1}
${shipping.address_2 ? shipping.address_2 + '\n' : ''}${shipping.city}, ${shipping.state} ${shipping.postcode}
${shipping.country}

Состав заказа:
${line_items
      .map(
          (item) =>
              `${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToLocale(item.price, order.currency)}`
      )
      .join('\n')}

Итого:
${formatPriceToLocale(total, order.currency)}
  `.trim();
}