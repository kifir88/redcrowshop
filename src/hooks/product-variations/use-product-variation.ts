import type {AxiosResponse} from "axios";
import {useQuery} from "@tanstack/react-query";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {fetchProductVariation} from "@/libs/woocommerce-rest-api";

export default function useProductVariation({
  productId,
  variationId,
}: {
  productId: number;
  variationId: number;
}) {
  const queryFn = (): Promise<AxiosResponse<ProductVariation>> => {
    return fetchProductVariation(productId, variationId);
  }

  return useQuery({
    queryKey: ["product-variation", productId, variationId],
    queryFn,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}