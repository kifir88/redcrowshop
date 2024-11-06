"use client";

import {Product} from "@/types/woo-commerce/product";
import {useLocalStorage} from "usehooks-ts";
import {CurrencyType, formatCurrency} from "@/libs/currency-helper";
import {useMemo} from "react";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {ProductVariation} from "@/types/woo-commerce/product-variation";

export default function ProductPrice({
  product,
  currencyRates,
  selectedProductVariation,
}: {
  product: Product,
  currencyRates: CustomCurrencyRates,
  selectedProductVariation?: ProductVariation,
}) {
  const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT")

  const priceValue = useMemo(() => {
    return formatCurrency(
      parseFloat(selectedProductVariation?.price ? selectedProductVariation?.price : product.price),
      selectedCurrency,
      currencyRates,
    )
  }, [selectedCurrency, product, currencyRates, selectedProductVariation]);

  return (
    <div
      className="text-xl font-medium text-gray-900"
    >
      {priceValue}
    </div>
  );
}