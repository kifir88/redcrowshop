import type {AxiosResponse} from "axios";
import {useQuery} from "@tanstack/react-query";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {fetchProduct, fetchProductVariation} from "@/libs/woocommerce-rest-api";
import {Product} from "@/types/woo-commerce/product";

export default function useProductVariation({
  productId,
  variationId,
  refreshKey,
}: {
  productId: number;
  variationId: number;
  refreshKey?: number;
}) {
  const queryFn = (): Promise<AxiosResponse<ProductVariation>> => {
    return fetchProductVariation(productId, variationId);
  }

  return useQuery({
    queryKey: ["product-variation", productId, variationId, refreshKey],
    queryFn,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}

