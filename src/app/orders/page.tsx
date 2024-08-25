"use client";

import useOrders from "@/hooks/order/useOrders";
import OrderRowItem from "@/components/pages/orders/order-row-item";

export default function OrdersPage() {
  const { data, isLoading } = useOrders({})

  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Мои заказы</h2>
          </div>

          <div className="mt-6 flow-root sm:mt-8">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data?.data.map(order => (
                <OrderRowItem key={order.id} order={order} />
              ))}
            </div>
          </div>

          {/*<Pagination currentPage={} /> /*/}
        </div>
      </div>
    </section>
  )
}