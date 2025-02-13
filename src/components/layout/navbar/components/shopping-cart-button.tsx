"use client";

import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {useLocalStorage} from "usehooks-ts";
import {CartItem} from "@/types/cart";
import Link from "next/link";
import {Button} from "flowbite-react";
import {CurrencyType, formatCurrency} from "@/libs/currency-helper";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {useState} from "react";
import Image from "next/image";

export default function ShoppingCartButton({currencyRates}: {currencyRates: CustomCurrencyRates}) {
  const [cartItems] = useLocalStorage<CartItem[]>("cartItems", [])
  const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT")

  const [isOpen, setIsOpen] = useState(false);

  const totalItemsCount = cartItems.reduce((accumulator, current) => {
    return accumulator + current.quantity;
  }, 0)
  const totalItemsPrice = cartItems.reduce((accumulator, current) => {
    return accumulator + current.price;
  }, 0)

  const formattedTotalItemsPrice = formatCurrency(
    totalItemsPrice,
    selectedCurrency,
    currencyRates,
  )

  return (
    <Popover className="z-50 ml-4 flow-root text-sm lg:relative lg:ml-8">
      <PopoverButton
        className="group -m-2 flex items-center p-2"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingBagIcon
          aria-hidden="true"
          className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {totalItemsCount}
        </span>
        <span className="sr-only">items in cart, view bag</span>
      </PopoverButton>
      <PopoverPanel
        hidden={!isOpen}
        transition
        className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-3 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5"
      >
        <h2 className="sr-only">Shopping Cart</h2>

        <form className="mx-auto max-w-2xl px-4">
          <ul role="list" className="divide-y divide-gray-200">
            {cartItems.map((product) => (
              <li key={product.productVariationId === -1 ? product.productId : product.productVariationId} className="flex items-center py-6">
                <Image
                  src={product?.imageSrc || "/category/product-image-placeholder.png"}
                  alt={product?.name || "image-placeholder"}
                  className="h-16 w-16 object-cover flex-none rounded-md border border-gray-200"
                  width={64}
                  height={64}
                />
                <div className="ml-4 flex-auto">
                  <h3 className="font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">{product.attributes.join(" - ")}</p>
                  <p className="font-normal text-gray-500">{`Количество: ${product.quantity}`}</p>
                  <p className="font-normal text-gray-500">{`Цена: ${product.price} ₸`}</p>
                </div>
              </li>
            ))}

            <li className="flex flex-col py-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  Стоимость товаров
                </h3>
                <p className="text-gray-500">
                  {formattedTotalItemsPrice}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  Доставка
                </h3>
                <p className="text-gray-500">
                  Бесплатно
                </p>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">
                  Сумма
                </h3>
                <p className="text-gray-500">
                  {formattedTotalItemsPrice}
                </p>
              </div>
            </li>
          </ul>

          {/*<button*/}
          {/*  type="submit"*/}
          {/*  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"*/}
          {/*>*/}
          {/*  Checkout*/}
          {/*</button>*/}

          <p className="mt-6 text-center">
            <Button
              as={Link}
              href="/cart"
              color="dark"
              onClick={() => setIsOpen(false)}
            >
              Перейти в корзину
            </Button>
          </p>
        </form>
      </PopoverPanel>
    </Popover>
  )
}