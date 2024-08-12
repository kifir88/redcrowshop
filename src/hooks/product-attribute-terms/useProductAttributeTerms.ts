'use client'

import {useQuery} from "@tanstack/react-query";
import {fetchProductAttributeTerms} from "@/libs/woocommerce-rest-api";

export default function useProductAttributeTerms(attributeId: string | number) {
  const queryFn = () => {
    return fetchProductAttributeTerms(String(attributeId))
  }

  return useQuery({
    queryKey: ["productAttributeTerms", attributeId],
    queryFn,
    enabled: !!attributeId,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
