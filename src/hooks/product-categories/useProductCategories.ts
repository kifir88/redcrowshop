'use client'

import {useQuery} from "@tanstack/react-query";
import {type AxiosResponse} from "axios";
import {fetchProductCategories} from "@/libs/woocommerce-rest-api";
import {ProductCategory} from "@/types/woo-commerce/product-category";

export default function useProductCategories({
  orderby,
  // ID 320 - Номенклатура
  // ID 294 - Одежда
  exclude,
  parent,
}: {
  orderby?: string
  exclude?: number[]
  parent?: number
} = {}) {
  const queryFn = (): Promise<AxiosResponse<ProductCategory[]>> => {
    const params: Record<string, string> = {}

    if (orderby) {
      params.orderby = orderby;
    }
    if (!!exclude && !!exclude.length) {
      params.exclude = exclude.join(",")
    }
    if (parent) {
      params.parent = String(parent)
    }

    return fetchProductCategories(params)
  }

  return useQuery({
    queryKey: ["product-categories", orderby, exclude, parent],
    queryFn,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}