"use client";

import { CartItem } from "@/types/cart";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import Image from "next/image";
import useProductVariation from "@/hooks/product-variations/use-product-variation";
import { Spinner } from "flowbite-react";
import toast from "react-hot-toast";
import ClientOnly from "@/components/client_only";

const MinusSvg = (
    <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true"
         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M1 1h16"/>
    </svg>
);

const PlusSvg = (
    <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true"
         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 1v16M1 9h16"/>
    </svg>
);

const Overlay = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
        <div className="bg-white p-4 rounded-lg shadow text-center space-y-3">
            {children}
        </div>
    </div>
);

export default function CartListItem({
                                         cartItem,
                                         currencyRates,
                                         onOverlayOpen,
                                         onOverlayClose,
                                     }: {
    cartItem: CartItem;
    currencyRates: CustomCurrencyRates;
    onOverlayOpen?: () => void;
    onOverlayClose?: () => void;
}) {

    const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cartItems", []);

    const handleRemove = () => {
        const updatedItems = cartItems.filter(
            item => item.productVariationId !== cartItem.productVariationId ||
                (item.productVariationId === -1 && item.productId !== cartItem.productId)
        );
        setCartItems(updatedItems);
    };

    const {data, isLoading, isError} = useProductVariation({
        productId: cartItem.productId,
        variationId: cartItem.productVariationId,
    });

    useEffect(() => {
        if (isError) {
            handleRemove();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError]);

    const updateCartItemQuantity = useCallback((item: CartItem, newQuantity: number) => {
        const updatedItems = cartItems.map(ci =>
            ci.productVariationId === item.productVariationId && ci.productVariationId !== -1
                ? { ...ci, quantity: newQuantity }
                : ci.productVariationId === -1 && ci.productId === item.productId
                    ? { ...ci, quantity: newQuantity }
                    : ci
        );

        setCartItems(updatedItems);
    }, [cartItems, setCartItems]);

    const handleIncrement = () => {
        const incrementedValue = cartItem.quantity + 1;

        const attrsText =
            cartItem.attributes && cartItem.attributes.length > 0
                ? cartItem.attributes.join(", ")
                : "";

        if (data?.data) {
            if (incrementedValue <= (data?.data.stock_quantity || 0)) {
                updateCartItemQuantity(cartItem, incrementedValue);
            } else {
                toast.error(
                    `Товара ${cartItem.name}${attrsText ? " (" + attrsText + ")" : ""} есть только ${
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

    // === STOCK CHECKS ===
    const stock = data?.data?.stock_quantity ?? 0;
    const hasNoStock = stock === 0;
    const notEnoughStock = stock > 0 && cartItem.quantity > stock;
    const isOverlayOpen = Boolean(data?.data && (hasNoStock || notEnoughStock));
    const overlayPrevRef = useRef<boolean>(false);

    useEffect(() => {
        const prev = overlayPrevRef.current;
        if (!prev && isOverlayOpen) {
            onOverlayOpen?.();
        } else if (prev && !isOverlayOpen) {
            onOverlayClose?.();
        }
        overlayPrevRef.current = isOverlayOpen;

        return () => {
            if (overlayPrevRef.current) {
                onOverlayClose?.();
            }
        };
    }, [isOverlayOpen, onOverlayOpen, onOverlayClose]);

    return (
        <ClientOnly>
            <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">

                {/* === OVERLAY IF STOCK PROBLEMS === */}
                {data?.data && hasNoStock && (
                    <Overlay>
                        <p className="text-red-600 font-semibold">Товар недоступен</p>
                        <button
                            onClick={handleRemove}
                            className="px-4 py-2 rounded bg-red-600 text-white"
                        >
                            Удалить из корзины
                        </button>
                    </Overlay>
                )}

                {data?.data && notEnoughStock && (
                    <Overlay>
                        <p className="text-yellow-600 font-semibold">
                            Доступно только: {stock}
                        </p>
                        <button
                            onClick={() => updateCartItemQuantity(cartItem, stock)}
                            className="px-4 py-2 rounded bg-yellow-500 text-white"
                        >
                            Установить {stock} шт.
                        </button>
                    </Overlay>
                )}

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
                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
                                >
                                    {MinusSvg}
                                </button>
                                <input
                                    type="text"
                                    className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none dark:text-white"
                                    value={cartItem.quantity}
                                    readOnly
                                />
                                <button
                                    type="button"
                                    onClick={handleIncrement}
                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    {PlusSvg}
                                </button>
                            </div>

                            <div className="text-end md:order-4 md:w-32">
                                {currencyRates ? (
                                    data.data.on_sale ? (
                                        <p className="text-base font-bold text-red-600 ml-5">
                                            {formatCurrency(Number(data.data.sale_price), selectedCurrency, currencyRates)}
                                            <span className="ml-2 text-gray-500 line-through text-xs">
                                {formatCurrency(Number(data.data.regular_price), selectedCurrency, currencyRates)}
                              </span>
                                        </p>
                                    ) : (
                                        <p className="text-base font-bold text-gray-900 dark:text-white ml-5">
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
                                    <svg className="me-1.5 h-5 w-5" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                         fill="none" viewBox="0 0 24 24">
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
