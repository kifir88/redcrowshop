import {fetchOrder, updateOrder} from "@/libs/woocommerce-rest-api";
import {formatPriceToKZT} from "@/libs/helper-functions";
import OrderPaymentButton from "@/components/pages/order-detail/order-payment-button";
import {Order} from "@/types/woo-commerce/order";
import {Badge} from "flowbite-react";

export default async function OrderDetail({
  params: { orderId },
  searchParams: {
    paymentOption,
    paymentId,
  },
}: {
  params: {
    orderId: string;
  };
  searchParams: {
    paymentOption?: string;
    paymentId?: string;
  }
}) {
  let orderData = await fetchOrder(orderId)

  if (paymentOption && paymentId && !orderData.data.date_paid_gmt) {
    const payload: Partial<Order> = {
      payment_method: paymentOption,
      transaction_id: paymentId,
      status: "processing",
    }
    orderData = await updateOrder(orderId, payload)
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Заказ {orderData?.data.number}
            </h2>

            {!!orderData.data.date_paid_gmt && (
              <Badge size="lg" color="green">
                Заказ оплачен
              </Badge>
            )}
          </div>


          <div className="mt-6 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Информация об оплате и доставке</h4>

            <dl>
              <dt className="text-base font-medium text-gray-900 dark:text-white">Данные о покупателе</dt>
              <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                {Object.values(orderData?.data.billing).filter(i => !!i).join(", ")}
              </dd>
            </dl>

            <dl>
              <dt className="text-base font-medium text-gray-900 dark:text-white">Данные Доставки</dt>
              <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                {Object.values(orderData?.data.shipping).filter(i => !!i).join(", ")}
              </dd>
            </dl>

            {/*<button type="button" data-modal-target="billingInformationModal" data-modal-toggle="billingInformationModal" className="text-base font-medium text-primary-700 hover:underline dark:text-primary-500">Edit</button>*/}
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
              <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {orderData?.data.line_items.map(li => (
                    <tr key={li.id}>
                      <td className="whitespace-nowrap py-4 md:w-[384px]">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center aspect-square w-10 h-10 shrink-0">
                            <img
                              className="h-auto w-full max-h-full dark:hidden"
                              src={li.image.src}
                              alt={li.image.alt}
                            />
                          </div>
                          <div className="hover:underline">
                            {li.name}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-base font-normal text-gray-900 dark:text-white">
                        {`x${li.quantity}`}
                      </td>

                      <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white">
                        {formatPriceToKZT(li.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Платеж</h4>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Стоимость товаров</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {formatPriceToKZT(orderData?.data.total)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Скидка
                    </dt>
                    <dd className="text-base font-medium text-green-500">
                      {`- ${formatPriceToKZT(orderData?.data.discount_total)}`}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">
                      Доставка
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {formatPriceToKZT(orderData?.data.shipping_total)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500 dark:text-gray-400">Налоги</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {formatPriceToKZT(orderData?.data.total_tax)}
                    </dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-lg font-bold text-gray-900 dark:text-white">
                    Конечная цена
                  </dt>
                  <dd className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPriceToKZT(orderData?.data.total)}
                  </dd>
                </dl>
              </div>

              <OrderPaymentButton order={orderData.data} disabled={!orderData?.data.total} />

            </div>
          </div>
        </div>
      </form>
    </section>
  )
}