import {fetchPage} from "@/libs/strapi-rest-api";
import {fetchOrder, updateOrder} from "@/libs/woocommerce-rest-api";
import {formatPriceToKZT} from "@/libs/helper-functions";
import ReactMarkdown from "react-markdown";
import {Order} from "@/types/woo-commerce/order";
import axios from "axios";
import config from "@/config"

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Record<string, string>
}) {

  // Check if the environment variable is loaded and has the key
  const pageId = config.PAGES && config.PAGES['payment_success']
      ? config.PAGES['payment_success']
      : 0;


  const [
    strapiPaymentSuccessPageData,
    orderData,
  ] = await Promise.all([
    //fetchPage("payment-success"),
    fetch(`https://admin.redcrow.kz/wp-json/wp/v2/posts/${pageId}`,{
      method: 'GET', // or 'POST'
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Instructs the browser to not store the cache
        'Pragma': 'no-cache', // For HTTP/1.0 compatibility
        'Expires': '0' // Proxies and others
      }
    }),
    fetchOrder(searchParams?.InvId)
  ])

  const txt = await strapiPaymentSuccessPageData.json();

  const parsedStrapiPage = txt.content.rendered
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


function generateOrderText(order: Order): string {
  const { billing, shipping, line_items, total } = order;

  return `
\n
Детали оплаты:\n
Имя: ${billing.first_name} ${billing.last_name}\n
Электронная почта: ${billing.email}\n
Телефон: ${billing.phone}\n
\n
Адрес для выставления счета:\n
${billing.address_1}\n
${billing.address_2 ? billing.address_2 + '\n' : ''}${billing.city}, ${billing.state} ${billing.postcode}\n
${billing.country}\n
\n
Адрес доставки:\n
${shipping.address_1}\n
${shipping.address_2 ? shipping.address_2 + '\n' : ''}${shipping.city}, ${shipping.state} ${shipping.postcode}\n
${shipping.country}\n
\n
Состав заказа:\n
${line_items
      .map(
          (item) =>
              `${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToKZT(item.price)}`
      )
      .join('\n')}
\n
Итого:\n
${formatPriceToKZT(total)}
  `.trim();
}