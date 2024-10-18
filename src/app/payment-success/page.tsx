import {fetchPage} from "@/libs/strapi-rest-api";
import {fetchOrder, updateOrder} from "@/libs/woocommerce-rest-api";
import {formatPriceToKZT} from "@/libs/helper-functions";
import ReactMarkdown from "react-markdown";
import {Order} from "@/types/woo-commerce/order";

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Record<string, string>
}) {
    const orderUpdatePayload: Partial<Order> = {
      payment_method: "RoboKassa",
      transaction_id: searchParams?.InvId,
      status: "processing",
    }

  const [
    strapiPaymentSuccessPageData,
    orderData,
  ] = await Promise.all([
    fetchPage("payment-success"),
    updateOrder(searchParams?.InvId, orderUpdatePayload)
  ])

  const productList = orderData?.data.line_items
    .map(li => (`- ${li.name} / ${li.quantity} / ${formatPriceToKZT(li.total)}`))
    .join();

  const parsedStrapiPage = strapiPaymentSuccessPageData.data.data.attributes.content
    .replace("[[ORDER_ID]]", searchParams?.InvId)
    .replace("[[TOTAL_PRICE]]", formatPriceToKZT(orderData.data.total))
    .replace("[[PRODUCT_LIST]]", productList);

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