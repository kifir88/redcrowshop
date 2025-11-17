"use client"

import {CartItem} from "@/types/cart";
import {useLocalStorage} from "usehooks-ts";
import {useCallback, useEffect, useState} from "react";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {CurrencyType, formatCurrency} from "@/libs/currency-helper";
import Image from "next/image";
import useProductVariation from "@/hooks/product-variations/use-product-variation";
import {Spinner} from "flowbite-react";
import toast from "react-hot-toast";
import ClientOnly from "@/components/client_only";
import useProduct from "@/hooks/products/useProduct";

const MinusSvg = (
  <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M1 1h16"/>
  </svg>
)
const PlusSvg = (
  <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true"
       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M9 1v16M1 9h16"/>
  </svg>
)

export default function CartListItem({
                                       cartItem,
                                       currencyRates,
                                     }: {
  cartItem: CartItem;
  currencyRates: CustomCurrencyRates;
}) {

    const handleRemove = () => {
        const updatedItems = cartItems.filter(
            item => item.productVariationId !== cartItem.productVariationId || (item.productVariationId === -1 && item.productId != cartItem.productId)
        );
        setCartItems(updatedItems);
    };


    const {data, isLoading, isError} = useProductVariation({
    productId: cartItem.productId,
    variationId: cartItem.productVariationId,
  });

  if(isError){
      handleRemove();
  }

  const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cartItems", []);

  const updateCartItemQuantity = useCallback((item: CartItem, newQuantity: number) => {
    const updatedItems = cartItems.map(cartItem =>
        cartItem.productVariationId === item.productVariationId && cartItem.productVariationId !== -1
            ? { ...cartItem, quantity: newQuantity }
            : cartItem.productVariationId === -1
                ? { ...cartItem, quantity: newQuantity }
                : cartItem
    );

    setCartItems(updatedItems);
  }, [cartItems, setCartItems]);

  const handleIncrement = () => {
    const incrementedValue = cartItem.quantity + 1;

    const a = cartItem.attributes !== null && cartItem.attributes.length > 0;
    const attrsS = cartItem.attributes.join(", ");

    if (data?.data) {
      if (incrementedValue <= (data?.data.stock_quantity || 0)) {
        updateCartItemQuantity(cartItem, incrementedValue);
      } else {
        toast.error(
            `Товара с названием ${cartItem.name}${a? " и аттрибутами " + attrsS : ""} в наличии только ${
                data?.data.stock_quantity || 0
            }`
        );
      }
    }
  };

  const handleDecrement = () => {
    if (cartItem.quantity > 1) {
      updateCartItemQuantity(cartItem, cartItem.quantity - 1);
    }
  };




  return (
      <ClientOnly>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
        {isLoading && (
            <div className="flex w-full justify-center">
              <Spinner />
            </div>
        )}
        {data?.data && (
            <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
              <div className="shrink-0 md:order-1">
                <Image
                    className="h-20 w-20 object-cover"
                    src={data?.data.image?.src || "/category/product-image-placeholder.png"}
                    alt={data?.data.image?.src || "image-placeholder"}
                    width={80}
                    height={80}
                />
              </div>

              <label htmlFor="counter-input" className="sr-only">Choose quantity:</label>
              <div className="flex items-center justify-between md:order-3 md:justify-end">
                <div className="flex items-center">
                  <button
                      type="button"
                      onClick={handleDecrement}
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                  >
                    {MinusSvg}
                  </button>
                  <input
                      type="text"
                      className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                      value={cartItem.quantity}
                      readOnly
                  />
                  <button
                      type="button"
                      onClick={handleIncrement}
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                  >
                    {PlusSvg}
                  </button>
                </div>
                <div className="text-end md:order-4 md:w-32">
                  {currencyRates ? (
                      data.data.on_sale ? (
                          <p className="text-base font-bold text-red-600" style={{marginLeft: 20}}>
                            {formatCurrency(Number(data.data.sale_price), selectedCurrency, currencyRates)}
                            <span className="ml-2 text-gray-500 line-through" style={{fontSize: "0.7rem"}}>
                          {formatCurrency(Number(data.data.regular_price), selectedCurrency, currencyRates)}
                        </span>
                          </p>
                      ) : (
                          <p className="text-base font-bold text-gray-900 dark:text-white" style={{marginLeft: 20}}>
                            {formatCurrency(Number(data.data.price), selectedCurrency, currencyRates)}
                          </p>
                      )
                  ) : (
                      "Loading..."
                  )}
                </div>
              </div>

              <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                <a href={cartItem.product_url} className="text-base font-medium text-gray-900 hover:underline dark:text-white">
                  {[cartItem.name, ...cartItem.attributes].join(", ")}
                </a>

                <div className="flex items-center gap-4">
                  <button
                      type="button"
                      onClick={handleRemove}
                      className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                  >
                    <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                         width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                    Удалить
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
      </ClientOnly>
  );
}
