"use client";

import { useEffect } from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import ClientOnly from "@/components/client_only";
import CartListItem from "@/components/pages/cart/cart-list-item";
import CartListItemSimple from "@/components/pages/cart/cart-list-item-simple";
import ContactData from "./contact_data";
import ShippingDialog from "./shipping_dialog";
import { useCart } from "@/hooks/cart";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import toast from "react-hot-toast";

interface CartContentProps {
  currencyRates: CustomCurrencyRates;
}

export default function CartContent({ currencyRates }: CartContentProps) {
  const {
    cartItems,
    isCartEmpty,
    deliveryPrice,
    deliveryValid,
    setDeliveryValid,
    setShippingCost,
    totalPrice,
    formatCurrency,
    shippingLines,
    handlePushOrder,
    handleProductsCheckComplete,
    isOrderLoading,
    storedCurrency,
    setStoredCurrency,
    refreshProducts,
    setRefreshProducts,
    productsLoading,
    setProductsLoading,
    waitProductsCheck,
    setWaitProductsCheck,
    activeOverlays,
    registerOverlay,
    unregisterOverlay,
  } = useCart({ currencyRates });

  // Sync currency with localStorage on mount
  useEffect(() => {
    if (storedCurrency) {
      setStoredCurrency(storedCurrency);
    }
  }, [storedCurrency, setStoredCurrency]);

  // Handle product check completion
  useEffect(() => {
    if (waitProductsCheck && productsLoading === 0) {
      handleProductsCheckComplete();
    }
  }, [waitProductsCheck, productsLoading, handleProductsCheckComplete]);

  // Reset refresh trigger after validation
  useEffect(() => {
    if (refreshProducts > 0) {
      setRefreshProducts(0);
    }
  }, [refreshProducts, setRefreshProducts]);

  return (
    <ClientOnly>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Корзина
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            {/* Left column - Cart items */}
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                {isCartEmpty ? (
                  <div className="flex flex-col items-start gap-4">
                    <h6 className="text-xl text-gray-700">
                      Ваша корзина пуста
                    </h6>
                    <Button as={Link} href="/shop" color="dark">
                      Продолжить покупки
                    </Button>
                  </div>
                ) : (
                  cartItems.map((ct) => (
                    <div
                      key={
                        ct.productVariationId === -1
                          ? ct.productId
                          : ct.productVariationId
                      }
                    >
                      {ct.productVariationId === -1 ? (
                        <CartListItemSimple
                          cartItem={ct}
                          currencyRates={currencyRates}
                          onOverlayOpen={registerOverlay}
                          onOverlayClose={unregisterOverlay}
                          refreshProducts={refreshProducts}
                          setProductsLoading={setProductsLoading}
                        />
                      ) : (
                        <CartListItem
                          cartItem={ct}
                          currencyRates={currencyRates}
                          onOverlayOpen={registerOverlay}
                          onOverlayClose={unregisterOverlay}
                          refreshProducts={refreshProducts}
                          setProductsLoading={setProductsLoading}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>

              <ShippingDialog
                currencyRates={currencyRates}
                deliveryValid={deliveryValid}
                setDeliveryValid={setDeliveryValid}
                setShippingCost={setShippingCost}
              />
              <ContactData />
            </div>

            {/* Right column - Order summary */}
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Описание заказа
                </p>

                <div className="space-y-4">
                  {/* Items total */}
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Стоимость товаров
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        {formatCurrency(
                          cartItems.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                        )}
                      </dd>
                    </dl>

                    {/* Delivery */}
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Доставка
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        {formatCurrency(deliveryPrice)}
                      </dd>
                    </dl>
                  </div>

                  {/* Total */}
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Сумма
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      {formatCurrency(totalPrice)}
                    </dd>
                  </dl>
                </div>

                <Button
                  color="dark"
                  size="sm"
                  fullSized
                  disabled={!totalPrice || !deliveryValid || activeOverlays > 0 || isOrderLoading}
                  onClick={handlePushOrder}
                >
                  {isOrderLoading ? "Создание заказа..." : "Создать заказ"}
                </Button>

                {activeOverlays > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Для создания заказа закройте все подсказки/уведомления о
                    стоке.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ClientOnly>
  );
}

