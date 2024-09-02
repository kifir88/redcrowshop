"use client";

import {Product} from "@/types/woo-commerce/product";
import {useLocalStorage} from "usehooks-ts";
import {CurrencyType, formatCurrency} from "@/libs/currency-helper";
import {useMemo} from "react";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";

export default function ProductPrice({product, currencyRates}: {product: Product, currencyRates: CustomCurrencyRates}) {
  const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT")

  const priceValue = useMemo(() => {
    return formatCurrency(
      parseFloat(product.price),
      selectedCurrency,
      currencyRates,
    )
  }, [selectedCurrency, product, currencyRates]);

  return (
    <div
      className="text-xl font-medium text-gray-900"
    >
      {priceValue}
    </div>
  );
}