import OrderDetailClient from "@/components/order-detail_clinet";
import { fetchCurrencyRates, fetchOrder } from "@/libs/woocommerce-rest-api";

interface OrderDetailProps {
  params: { orderId: string };
}

export default async function OrderDetail({ params: { orderId } }: OrderDetailProps) {
  const orderData = await fetchOrder(orderId);
  const currencyRates = await fetchCurrencyRates();

  return <OrderDetailClient orderData={orderData.data} currencyRates={currencyRates.data} />;
}
