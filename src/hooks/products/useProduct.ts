import type { AxiosResponse } from "axios";
import { fetchProduct } from "@/libs/woocommerce-rest-api";
import { Product } from "@/types/woo-commerce/product";
import { useQuery } from "@tanstack/react-query";

export default function useProduct({
    productId, refreshKey
}: {
    productId: number, refreshKey?: number
}) {
    const queryFn = (): Promise<AxiosResponse<Product>> => {
        return fetchProduct(productId);
    }

    const queryFnProd = (): Promise<AxiosResponse<Product>> => {
        return fetchProduct(productId);
    }

    return useQuery({
        queryKey: ["product-simple", productId, refreshKey], // добавили refreshKey
        queryFn,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    })
}