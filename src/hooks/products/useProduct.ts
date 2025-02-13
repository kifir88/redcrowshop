import type {AxiosResponse} from "axios";
import {fetchProduct} from "@/libs/woocommerce-rest-api";
import {Product} from "@/types/woo-commerce/product";
import {useQuery} from "@tanstack/react-query";

export default function useProduct({
                                       productId,
                                   }: {
    productId: number;
}) {
    const queryFn = (): Promise<AxiosResponse<Product>> => {
        return fetchProduct(productId);
    }

    const queryFnProd = (): Promise<AxiosResponse<Product>> => {
        return fetchProduct(productId);
    }

    return useQuery({
        queryKey: ["product-simple", productId],
        queryFn,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    })
}