import CartContent from "@/components/pages/cart/cart-content";
import {fetchCurrencyRates} from "@/libs/woocommerce-rest-api";

export default async function CartPage() {
  const currencyRatesData = await fetchCurrencyRates();

  return (
    <CartContent currencyRates={currencyRatesData.data} />
  )
}