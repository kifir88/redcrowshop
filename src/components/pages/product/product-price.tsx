"use client";

import { Product } from "@/types/woo-commerce/product";
import { useLocalStorage } from "usehooks-ts";
import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import { useMemo } from "react";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import { ProductVariation } from "@/types/woo-commerce/product-variation";

export default function ProductPrice({
                                         product,
                                         currencyRates,
                                         selectedProductVariation,
                                         variationBase
                                     }: {
    product: Product;
    currencyRates: CustomCurrencyRates;
    selectedProductVariation?: ProductVariation;
    variationBase? : ProductVariation
}) {
    const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");

    // Получаем regular_price: если у продукта его нет, берём из первой вариации
    const productRegularPrice = product.regular_price || (variationBase?.regular_price || product.regular_price);

    const price1 = selectedProductVariation
        ? selectedProductVariation.regular_price
        : productRegularPrice;

    const regularPrice = formatCurrency(parseFloat(price1), selectedCurrency, currencyRates);

    const price = selectedProductVariation?.sale_price || (variationBase?.sale_price || product?.sale_price);

    const salePrice = price
        ? formatCurrency(parseFloat(price), selectedCurrency, currencyRates)
        : null;

    return (
        <div className="text-xl font-medium text-gray-900">
            {salePrice ? (
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500 line-through">{regularPrice}</span>
                    <span className="text-red-600 font-semibold">{salePrice}</span>
                </div>
            ) : (
                <span>{regularPrice}</span>
            )}
        </div>
    );
}
