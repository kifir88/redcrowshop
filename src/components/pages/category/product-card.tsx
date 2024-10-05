'use client';

import {Product} from "@/types/woo-commerce/product";
import Link from "next/link";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {useLocalStorage} from "usehooks-ts";
import {CurrencyType, formatCurrency} from "@/libs/currency-helper";
import {useMemo} from "react";
import Image from "next/image";
import {cn} from "@/libs/utils";

const ProductCard = ({product, currencyRates}: {product: Product; currencyRates: CustomCurrencyRates}) => {
  const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT")

  const image = product.images[0];
  const imageSrc = image?.src || "/category/product-image-placeholder.png";
  const imageAlt = image?.alt || "placeholder";

  const categorySlug = product.categories[0].slug;

  const priceValue = useMemo(() => {
    return formatCurrency(
      parseFloat(product.price),
      selectedCurrency,
      currencyRates,
    )
  }, [selectedCurrency, product, currencyRates]);

  const isOutOfStock = product.stock_status === "outofstock";

  const Wrapper = isOutOfStock
    ? 'div'
    : Link;

  return (
    <Wrapper
      key={product.id}
      href={`/category/${categorySlug}/${product.slug}`}
      className="group text-sm"
    >
      <div className={cn(
        "relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100",
        !isOutOfStock && "group-hover:opacity-75"
      )}>
        <Image
          className="aspect-square h-full w-full object-cover object-center"
          src={imageSrc}
          alt={imageAlt}
          width={384}
          height={384}
        />

        {isOutOfStock && (
          <div
            className={cn(
            "backdrop-blur-sm bg-white/30",
              "z-20 absolute top-0 left-0 right-0 bottom-0",
              "flex justify-center items-center"
            )}
          >
            <p
              className={cn(
                "text-center font-medium text-gray-900"
              )}
            >
              Товара нет в наличии
            </p>
          </div>
        )}
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{product.name}</h3>
      <p className="italic text-gray-500">{product.categories[0]?.name}</p>
      <div
        className="mt-2 font-medium text-gray-900"
      >
        {priceValue}
      </div>
    </Wrapper>
  )
}

export default ProductCard;