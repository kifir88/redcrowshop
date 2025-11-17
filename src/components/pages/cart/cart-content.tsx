"use client";

import CartListItem from "@/components/pages/cart/cart-list-item";
import { useLocalStorage } from "usehooks-ts";
import { CartItem } from "@/types/cart";
import { useEffect, useState, useCallback } from "react";
import ShippingDetailsDialog from "@/components/pages/cart/shipping-details-dialog";
import { Button } from "flowbite-react";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import Link from "next/link";
import ClientOnly from "@/components/client_only";
import CartListItemSimple from "@/components/pages/cart/cart-list-item-simple";

export default function CartContent({ currencyRates }: { currencyRates: CustomCurrencyRates }) {

    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("KZT");

    const [storedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cartItems", []);
    const [isShippingDialogOpened, setShippingDialogOpened] = useState<boolean>(false);

    // new: count active overlays
    const [activeOverlays, setActiveOverlays] = useState<number>(0);

    useEffect(() => {
        if (storedCurrency) {
            setSelectedCurrency(storedCurrency);
        }
    }, [storedCurrency]);

    const totalOriginalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleOpenShippingDialog = () => {
        setShippingDialogOpened(true);
    };
    const handleCloseShippingDialog = () => {
        setShippingDialogOpened(false);
    };

    // overlay register/unregister helpers
    const registerOverlay = useCallback(() => {
        setActiveOverlays(prev => prev + 1);
    }, []);
    const unregisterOverlay = useCallback(() => {
        setActiveOverlays(prev => Math.max(prev - 1, 0));
    }, []);

    return (
        <ClientOnly>
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        Корзина
                    </h2>

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                            <div className="space-y-6">
                                {!cartItems.length && (
                                    <div className="flex flex-col items-start gap-4">
                                        <h6 className="text-xl text-gray-700">
                                            Ваша корзина пуста
                                        </h6>
                                        <Button as={Link} href="/shop" color="dark">
                                            Продолжить покупки
                                        </Button>
                                    </div>
                                )}
                                {cartItems.map((ct) => {

                                    return ct.productVariationId === -1 ? (
                                        <div key={ct.productId}>
                                            <CartListItemSimple
                                                cartItem={ct}
                                                currencyRates={currencyRates}
                                                onOverlayOpen={registerOverlay}
                                                onOverlayClose={unregisterOverlay}
                                            />
                                        </div>
                                    ) : (
                                        <div key={ct.productVariationId}>
                                            <CartListItem
                                                cartItem={ct}
                                                currencyRates={currencyRates}
                                                onOverlayOpen={registerOverlay}
                                                onOverlayClose={unregisterOverlay}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                            <div
                                className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Описание заказа
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                                                Стоимость товаров
                                            </dt>
                                            <dd className="text-base font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(totalOriginalPrice, selectedCurrency, currencyRates)}
                                            </dd>
                                        </dl>

                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Доставка</dt>
                                            <dd className="text-base font-medium text-green-600">
                                                {formatCurrency(0, selectedCurrency, currencyRates)}
                                            </dd>
                                        </dl>

                                    </div>

                                    <dl
                                        className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                        <dt className="text-base font-bold text-gray-900 dark:text-white">
                                            Сумма
                                        </dt>
                                        <dd className="text-base font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(totalOriginalPrice, selectedCurrency, currencyRates)}
                                        </dd>
                                    </dl>
                                </div>

                                <Button
                                    color="dark"
                                    size="sm"
                                    fullSized
                                    disabled={!totalOriginalPrice || activeOverlays > 0}
                                    onClick={handleOpenShippingDialog}
                                >
                                    Создать заказ
                                </Button>
                                {activeOverlays > 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Для создания заказа закройте все подсказки/уведомления о стоке.
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <ShippingDetailsDialog isOpen={isShippingDialogOpened} closeModal={handleCloseShippingDialog} currencyRates={currencyRates} selectedCurrency={selectedCurrency} />
            </section>
        </ClientOnly>
    );
}
