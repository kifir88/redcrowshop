'use client'

import {useQuery} from "@tanstack/react-query";
import {fetchOrders} from "@/libs/woocommerce-rest-api";
import {Order} from "@/types/woo-commerce/order";

export default function useOrders({
  page,
  per_page,
  status,
}: {
  page?: number,
  per_page?: number,
  status?: Order["status"],
}) {
  const queryFn = () => {
    const params: Record<string, string> = {}

    if (page) {
      params.page = String(page);
    }
    if (per_page) {
      params.per_page = String(per_page);
    }
    if (status) {
      params.status = status;
    }

    return fetchOrders(params)
  }

  return useQuery({
    queryKey: ["orders", page, status],
    queryFn,
  })
}
