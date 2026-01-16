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

interface CartContentProps {
  currencyRates: CustomCurrencyRates;
}

export default function CartContent({ currencyRates }: CartContentProps) {
  // Используем сгруппированный API
  const {
    cart,
    client,
    totals,
    delivery,
    validation,
    overlays,
    checkout,
  } = useCart({ currencyRates });

  // Sync currency with localStorage on mount
  useEffect(() => {
    if (client.currency) {
      client.setCurrency(client.currency);
    }
  }, [client.currency, client.setCurrency]);

  // Handle product check completion
  useEffect(() => {
    if (validation.waitProductsCheck && validation.productsLoading === 0) {
      checkout.handleProductsCheckComplete();
    }
  }, [
    validation.waitProductsCheck,
    validation.productsLoading,
    checkout.handleProductsCheckComplete,
  ]);

  // Reset refresh trigger after validation
  useEffect(() => {
    if (validation.refreshProducts > 0) {
      validation.setRefreshProducts(() => 0);
    }
  }, [validation.refreshProducts, validation.setRefreshProducts]);

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
                {totals.isCartEmpty ? (
                  <div className="flex flex-col items-start gap-4">
                    <h6 className="text-xl text-gray-700">
                      Ваша корзина пуста
                    </h6>
                    <Button as={Link} href="/shop" color="dark">
                      Продолжить покупки
                    </Button>
                  </div>
                ) : (
                  cart.items.map((ct) => (
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
                          onOverlayOpen={overlays.registerOverlay}
                          onOverlayClose={overlays.unregisterOverlay}
                          refreshProducts={validation.refreshProducts}
                          setProductsLoading={validation.setProductsLoading}
                        />
                      ) : (
                        <CartListItem
                          cartItem={ct}
                          currencyRates={currencyRates}
                          onOverlayOpen={overlays.registerOverlay}
                          onOverlayClose={overlays.unregisterOverlay}
                          refreshProducts={validation.refreshProducts}
                          setProductsLoading={validation.setProductsLoading}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>

              <ContactData
                customerValid={validation.customerValid}
                setCustomerValid={validation.setCustomerValid}
              />

              <ShippingDialog
                currencyRates={currencyRates}
                deliveryValid={delivery.deliveryValid}
                setDeliveryValid={delivery.setDeliveryValid}
                setShippingCost={delivery.setShippingCost}
              />
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
                        {totals.formatPrice(totals.itemsTotalPrice)}
                      </dd>
                    </dl>

                    {/* Delivery */}
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Доставка
                      </dt>
                      <dd className="text-base font-medium text-green-600">
                        {totals.formatPrice(delivery.deliveryPrice)}
                      </dd>
                    </dl>
                  </div>

                  {/* Total */}
                  <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                    <dt className="text-base font-bold text-gray-900 dark:text-white">
                      Сумма
                    </dt>
                    <dd className="text-base font-bold text-gray-900 dark:text-white">
                      {totals.formatPrice(totals.totalPrice)}
                    </dd>
                  </dl>
                </div>

                <Button
                  color="dark"
                  size="sm"
                  fullSized
                  disabled={
                    !totals.totalPrice ||
                    !delivery.deliveryValid ||
                    overlays.activeOverlays > 0 ||
                    checkout.isOrderLoading ||
                    !validation.customerValid
                  }
                  onClick={checkout.handlePushOrder}
                >
                  {checkout.isOrderLoading ? "Создание заказа..." : "Создать заказ"}
                </Button>

                {overlays.activeOverlays > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Для создания заказа исправьте все подсказки/уведомления для товаров.
                  </p>
                )}
                {!validation.customerValid && (
                  <p className="text-sm text-gray-500 mt-2">
                    Укажите ваши контактные данные
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

