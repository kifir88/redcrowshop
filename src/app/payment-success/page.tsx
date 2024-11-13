import {fetchPage} from "@/libs/strapi-rest-api";
import {fetchOrder, updateOrder} from "@/libs/woocommerce-rest-api";
import {formatPriceToKZT} from "@/libs/helper-functions";
import ReactMarkdown from "react-markdown";
import {Order} from "@/types/woo-commerce/order";
import axios from "axios";

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Record<string, string>
}) {

  const [
    strapiPaymentSuccessPageData,
    orderData,
  ] = await Promise.all([
    fetchPage("payment-success"),
    fetchOrder(searchParams?.InvId)
  ])

  const parsedStrapiPage = strapiPaymentSuccessPageData.data.data.attributes.content
    .replace("[[ORDER_ID]]", searchParams?.InvId)
    .replace("[[ORDER_DETAILS]]", generateOrderText(orderData.data))

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Успешная оплата заказа #{orderData?.data.number}
            </h2>
          </div>

          <div className="mt-10 prose w-full max-w-none lg:prose-xl">
            <ReactMarkdown>
              {parsedStrapiPage}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  )
}


function generateOrderText(order: Order): string {
  const { billing, shipping, line_items, total } = order;

  return `
\n
Детали оплаты:\n
Имя: ${billing.first_name} ${billing.last_name}<br/>
Электронная почта: ${billing.email}<br/>
Телефон: ${billing.phone}<br/>
<br/>
Адрес для выставления счета:<br/>
${billing.address_1}<br/>
${billing.address_2 ? billing.address_2 + '\n' : ''}${billing.city}, ${billing.state} ${billing.postcode}<br/>
${billing.country}<br/>
<br/>
Адрес доставки:<br/>
${shipping.address_1}<br/>
${shipping.address_2 ? shipping.address_2 + '\n' : ''}${shipping.city}, ${shipping.state} ${shipping.postcode}<br/>
${shipping.country}<br/>
<br/>
Состав заказа:<br/>
${line_items
      .map(
          (item) =>
              `${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToKZT(item.price)}`
      )
      .join('<br/>')}
<br/>
Итого:<br/>
${formatPriceToKZT(total)}
  `.trim();
}