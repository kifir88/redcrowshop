'use client'

import {useQuery} from "@tanstack/react-query";
import {fetchProducts} from "@/libs/woocommerce-rest-api";

export default function useProducts({
  enabled = true,
  page,
  slug,
  include,
  attributes,
}: {
  page?: number,
  enabled?: boolean,
  slug?: string,
  include?: string[],
  attributes: Record<string, string>
}) {
  const queryFn = () => {
    const params: Record<string, string> = {
      ...attributes
    }

    if (page) {
      params.page = String(page);
    }
    if (slug) {
      params.slug = slug;
    }
    if (!!include && !!include.length) {
      params.include = include.join(",");
    }

    return fetchProducts(params)
  }

  return useQuery({
    queryKey: ["products", page, slug, include, enabled, attributes],
    queryFn,
    enabled,
  })
}
