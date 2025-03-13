import {fetchPage} from "@/libs/strapi-rest-api";
import {fetchOrder, updateOrder} from "@/libs/woocommerce-rest-api";
import {formatPriceToKZT, formatPriceToLocale} from "@/libs/helper-functions";
import ReactMarkdown from "react-markdown";
import {Order} from "@/types/woo-commerce/order";
import axios from "axios";
import config from "@/config"
import {notFound} from "next/navigation";

export default async function PaymentSuccessPagePSP({
  searchParams
}: {
  searchParams: Record<string, string>
}) {

  // Check if the environment variable is loaded and has the key
  const pageId = config.PAGES && config.PAGES['payment_success']
      ? config.PAGES['payment_success']
      : 0;

  if (!searchParams.order_token) {
    return notFound(); // Show 404 if no token is provided
  }

  const [
    strapiPaymentSuccessPageData,
    orderData,
  ] = await Promise.all([
    //fetchPage("payment-success"),
    fetch(`https://admin.redcrow.kz/wp-json/wp/v2/posts/${pageId}?v=${new Date().getTime()}`,{
      method: 'GET', // or 'POST'
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Instructs the browser to not store the cache
        'Pragma': 'no-cache', // For HTTP/1.0 compatibility
        'Expires': '0' // Proxies and others
      }
    }),
    fetchOrder(searchParams?.InvId, searchParams?.order_token)
  ])

  const txt = await strapiPaymentSuccessPageData.json();

  if (!orderData) {
    return notFound(); // Show 404 if no token is provided
  }

  const parsedStrapiPage = txt.content.rendered
    .replace("[[ORDER_ID]]", searchParams?.InvId)
    .replace("[[ORDER_DETAILS]]", generateOrderText(orderData!.data))

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
            <div dangerouslySetInnerHTML={{
                __html: parsedStrapiPage
              }}>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function generateOrderText(order: Order | null): string {

  if (order===null) return "none";

  const { billing, shipping, line_items, total } = order;

  return `
<br\>
Детали оплаты:<br\>
Имя: ${billing.first_name} ${billing.last_name}<br\>
Электронная почта: ${billing.email}<br\>
Телефон: ${billing.phone}<br\>
<br\>
Адрес для выставления счета:<br\>
${billing.address_1}<br\>
${billing.address_2 ? billing.address_2 + '<br\>' : ''}${billing.city}, ${billing.state} ${billing.postcode}<br\>
${billing.country}<br\>
<br\>
Адрес доставки:<br\>
${shipping.address_1}<br\>
${shipping.address_2 ? shipping.address_2 + '\n' : ''}${shipping.city}, ${shipping.state} ${shipping.postcode}<br\>
${shipping.country}<br\>
<br\>
Состав заказа:<br\>
${line_items
      .map(
          (item) =>
              `${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToLocale(item.price, order.currency)}`
      )
      .join('<br\>')}
<br\>
<br\>
Итого:<br\>
${formatPriceToLocale(total, order.currency)}
  `.trim();
}