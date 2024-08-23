'use client'

import {useQuery} from "@tanstack/react-query";
import {fetchCustomProductAttributes} from "@/libs/woocommerce-rest-api";

export default function useCustomProductAttributes({
  categoryName,
}: {
  categoryName?: string
}) {
  const queryFn = () => {
    const params: Record<string, string> = {}

    if (categoryName) {
      params["category_name"] = categoryName;
    }

    return fetchCustomProductAttributes(params)
  }

  return useQuery({
    queryKey: ["productAttributes", categoryName],
    queryFn,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
