"use client";

import { CartItem } from "@/types/cart";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useEffect, useRef } from "react";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import Image from "next/image";
import { Spinner, Button } from "flowbite-react";
import toast from "react-hot-toast";
import ClientOnly from "@/components/client_only";
import useProduct from "@/hooks/products/useProduct";

const MinusSvg = (
    <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M1 1h16" />
    </svg>
);

const PlusSvg = (
    <svg className="h-2.5 w-2.5 text-gray-900" aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 1v16M1 9h16" />
    </svg>
);

const SmallOverlay = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
        <div className="p-3 text-center space-y-3 w-full max-w-xs">
            {children}
        </div>
    </div>
);

export default function CartListItemSimple({
    cartItem,
    currencyRates,
    onOverlayOpen,
    onOverlayClose,
    refreshProducts,
    setProductsLoading
}: {
    cartItem: CartItem;
    currencyRates: CustomCurrencyRates;
    onOverlayOpen?: () => void;
    onOverlayClose?: () => void;
    refreshProducts?: number;
    setProductsLoading?: (n: (prev: number) => number) => void;
}) {

    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cartItems", []);
    const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");

    const handleRemove = () => {
        const updatedItems = cartItems.filter(item => item.productId !== cartItem.productId);
        setCartItems(updatedItems);
    };

    const { data, isLoading, isError } = useProduct({
        productId: cartItem.productId,
        refreshKey: refreshProducts 
    });

    const wasLoading = useRef(false);
    const prevRefreshProducts = useRef(refreshProducts);
    
    useEffect(() => {
        // Reset wasLoading when refreshProducts changes to handle re-clicks
        if (refreshProducts !== prevRefreshProducts.current) {
            prevRefreshProducts.current = refreshProducts;
            wasLoading.current = true;
        }
        
        if (!setProductsLoading) return;
        if (isLoading) {
            wasLoading.current = true;
        } else if (wasLoading.current && !isLoading) {
            setProductsLoading(prev => Math.max(prev - 1, 0));
            wasLoading.current = false;
        }
    }, [isLoading, refreshProducts, setProductsLoading]);

    useEffect(() => {
        if (isError) handleRemove();
    }, [isError]);

    const updateCartItemQuantity = useCallback((item: CartItem, newQuantity: number) => {
        const updatedItems = cartItems.map(ci =>
            ci.productId === item.productId ? { ...ci, quantity: newQuantity } : ci
        );
        setCartItems(updatedItems);
    }, [cartItems, setCartItems]);

    const handleIncrement = () => {
        const incrementedValue = cartItem.quantity + 1;
        const attrsText = cartItem.attributes?.length ? cartItem.attributes.join(", ") : "";
        if (data?.data) {
            if (incrementedValue <= (data?.data.stock_quantity || 0)) {
                updateCartItemQuantity(cartItem, incrementedValue);
            } else {
                toast.error(`Товара ${cartItem.name}${attrsText ? " (" + attrsText + ")" : ""} есть только ${data?.data.stock_quantity || 0}`);
            }
        }
    };

    const handleDecrement = () => {
        if (cartItem.quantity > 1) updateCartItemQuantity(cartItem, cartItem.quantity - 1);
    };

    const stock = data?.data?.stock_quantity ?? 0;
    const notEnoughStock = stock > 0 && cartItem.quantity > stock;
    const hasNoStock = stock === 0;
    const isOverlayOpen = Boolean(data?.data && (hasNoStock || notEnoughStock));
    const overlayPrevRef = useRef<boolean>(false);

    useEffect(() => {
        const prev = overlayPrevRef.current;
        if (!prev && isOverlayOpen) onOverlayOpen?.();
        else if (prev && !isOverlayOpen) onOverlayClose?.();
        overlayPrevRef.current = isOverlayOpen;

        return () => { if (overlayPrevRef.current) onOverlayClose?.(); }
    }, [isOverlayOpen, onOverlayOpen, onOverlayClose]);

    return (
        <ClientOnly>
            <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">

                {isLoading && <div className="flex w-full justify-center"><Spinner /></div>}

                {data?.data && (
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">

                        {/* PRODUCT IMAGE */}
                        <div className="shrink-0 md:order-1">
                            <Image
                                className="h-20 w-20 object-cover"
                                src={data?.data.images?.[0]?.src || "/category/product-image-placeholder.png"}
                                alt={data?.data.images?.[0]?.src || "image-placeholder"}
                                width={80}
                                height={80}
                            />
                        </div>

                        {/* === QTY + PRICE BLOCK WITH OVERLAY === */}
                        <div className="relative flex flex-col sm:flex-row items-center justify-between md:order-3 md:justify-end mt-2 md:mt-0">

                            {(hasNoStock || notEnoughStock) && (
                                <SmallOverlay>
                                    {hasNoStock && (
                                        <>
                                            <p className="text-red-600 font-semibold">Товар закончился</p>
                                            <Button
                                                type="submit"
                                                color="dark"
                                                fullSized
                                                className="mt-3"
                                                onClick={handleRemove}
                                            >
                                                Удалить из корзины
                                            </Button>
                                        </>
                                    )}

                                    {notEnoughStock && (
                                        <>
                                            <p className="text-red-600 font-semibold">Доступно только: {stock} шт.</p>
                                            <Button
                                                type="submit"
                                                color="dark"
                                                fullSized
                                                className="mt-3"
                                                onClick={() => updateCartItemQuantity(cartItem, stock)}
                                            >
                                                Установить {stock} шт.
                                            </Button>
                                        </>
                                    )}
                                </SmallOverlay>
                            )}

                            {/* QTY FIELD */}
                            <div className="flex items-center z-10 mt-2 sm:mt-0">
                                <button
                                    type="button"
                                    onClick={handleDecrement}
                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                                    border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    {MinusSvg}
                                </button>

                                <input
                                    type="text"
                                    readOnly
                                    className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 dark:text-white"
                                    value={cartItem.quantity}
                                />

                                <button
                                    type="button"
                                    onClick={handleIncrement}
                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                                    border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    {PlusSvg}
                                </button>
                            </div>

                            {/* PRICE */}
                            <div className="text-end md:order-4 md:w-32 ml-4 z-10 mt-2 sm:mt-0">
                                {currencyRates ? (
                                    data.data.on_sale ? (
                                        <p className="text-base font-bold text-red-600">
                                            {formatCurrency(Number(data.data.sale_price), selectedCurrency, currencyRates)}
                                            <span className="ml-2 text-gray-500 line-through text-xs">
                                                {formatCurrency(Number(data.data.regular_price), selectedCurrency, currencyRates)}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="text-base font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(Number(data.data.price), selectedCurrency, currencyRates)}
                                        </p>
                                    )
                                ) : "Loading..."}
                            </div>
                        </div>

                        {/* PRODUCT NAME + REMOVE */}
                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <a href={cartItem.product_url} className="text-base font-medium text-gray-900 hover:underline dark:text-white">
                                {[cartItem.name, ...cartItem.attributes].join(", ")}
                            </a>

                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    onClick={handleRemove}
                                    className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                >
                                    <svg className="me-1.5 h-5 w-5" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M6 18 17.94 6M18 18 6.06 6" />
                                    </svg>
                                    Удалить
                                </Button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </ClientOnly>
    );
}
