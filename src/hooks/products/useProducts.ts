'use client'

import {useQuery} from "@tanstack/react-query";
import {fetchProducts} from "@/libs/woocommerce-rest-api";

export default function useProducts({
  enabled = true,
  slug,
  include,
}: {
  enabled?: boolean,
  slug?: string,
  include?: string[],
}) {
  const queryFn = () => {
    const params: Record<string, string> = {}

    if (slug) {
      params.slug = slug;
    }
    if (!!include && !!include.length) {
      params.include = include.join(",");
    }

    return fetchProducts(params)
  }

  return useQuery({
    queryKey: ["products", slug, include, enabled],
    queryFn,
    enabled,
  })
}
