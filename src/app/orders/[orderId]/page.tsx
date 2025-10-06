import OrderDetailClient from "@/components/order-detail_clinet";
import { fetchCurrencyRates, fetchOrder } from "@/libs/woocommerce-rest-api";
import { notFound } from "next/navigation";

interface OrderDetailPageParams {
    orderId: string;
}

interface OrderDetailSearchParams {
    order_token?: string;
}

export default async function OrderDetail({
                                              params,
                                              searchParams,
                                          }: {
    params: Promise<OrderDetailPageParams>;
    searchParams: Promise<OrderDetailSearchParams>;
}) {
    // Await params
    const { orderId } = await params;
    const orderToken = (await searchParams).order_token ?? "";

    if (!orderToken) {
        return notFound(); // Show 404 if no token is provided
    }

    const orderData = await fetchOrder(orderId, orderToken);

    if (!orderData) {
        return notFound(); // Show 404 if order is not found or token is invalid
    }

    const currencyRates = await fetchCurrencyRates();

    return (
        <OrderDetailClient
            orderData={orderData.data}
            currencyRates={currencyRates.data}
        />
    );
}
