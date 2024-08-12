'use client'

import {useQuery} from "@tanstack/react-query";
import {fetchProductAttributes} from "@/libs/woocommerce-rest-api";

export default function useProductAttributes() {
  const queryFn = () => {
    const params: Record<string, string> = {}

    return fetchProductAttributes(params)
  }

  return useQuery({
    queryKey: ["productAttributes"],
    queryFn,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
