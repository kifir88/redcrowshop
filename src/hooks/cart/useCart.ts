"use client";

import { useState, useCallback, useMemo, useTransition, useEffect } from "react";
import { CartItem, DeliveryMethod, DeliveryOption, ShippingLine } from "@/types/cart";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import { CurrencyType, formatCurrency, amountCurrency } from "@/libs/currency-helper";
import {
  useCartStorage,
  useClientDataStorage,
  useDeliveryAddressStorage,
  useCurrencyStorage,
} from "./useCartStorage";
import { useCartOrder } from "./useCartOrder";

interface UseCartProps {
  currencyRates: CustomCurrencyRates;
}

export function useCart({ currencyRates }: UseCartProps) {
  // Storage hooks
  const { cartItems, clearCartItems } = useCartStorage();
  const { clientData, setClientData } = useClientDataStorage();
  const { deliveryAddress, setDeliveryAddress } = useDeliveryAddressStorage();
  const { storedCurrency, setStoredCurrency } = useCurrencyStorage();
  const [customerValid, setCustomerValid] = useState<boolean>(false);

  // Delivery state
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [deliveryValid, setDeliveryValid] = useState<boolean>(false);
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([]);

  // Product validation state
  const [refreshProducts, setRefreshProducts] = useState<number>(0);
  const [productsLoading, setProductsLoading] = useState<number>(0);
  const [waitProductsCheck, setWaitProductsCheck] = useState<boolean>(false);

  // Overlay state for stock notifications
  const [activeOverlays, setActiveOverlays] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  // Order hook
  const { handleSubmit, isLoading: isOrderLoading } = useCartOrder({
    cartItems,
    clientData,
    deliveryAddress,
    storedCurrency,
    currencyRates,
    clearCartItems,
  });

  // Calculate totals
  const itemsTotalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => itemsTotalPrice + deliveryPrice,
    [itemsTotalPrice, deliveryPrice]
  );



  useEffect(() => {

    if (clientData.email)
      setCustomerValid(true)

  }, [clientData, setCustomerValid]);

  // Overlay registration
  const registerOverlay = useCallback(() => {
    setActiveOverlays((prev) => prev + 1);
  }, []);

  const unregisterOverlay = useCallback(() => {
    setActiveOverlays((prev) => Math.max(prev - 1, 0));
  }, []);

  // Delivery methods
  const setShippingCost = useCallback(
    (method: DeliveryMethod, option: DeliveryOption | null) => {
      if (method === "self") {
        setDeliveryPrice(0);
        setShippingLines([]);
      } else if (method === "cdek" && option) {
        setDeliveryPrice(option.delivery_sum);
        setShippingLines([
          {
            method_id: "cdek",
            method_title: `[${option.tariff_code}] ${option.tariff_name}`,
            total: option.delivery_sum,
          },
        ]);
      }
    },
    []
  );

  // Order creation
  const handlePushOrder = useCallback(() => {
    setProductsLoading(cartItems.length);
    setRefreshProducts((prev) => prev + 1);
    setWaitProductsCheck(true);
  }, [cartItems.length]);

  // Handle product check completion
  const handleProductsCheckComplete = useCallback(() => {
    if (waitProductsCheck && productsLoading === 0) {
      setWaitProductsCheck(false);

      if (activeOverlays === 0) {
        if (!deliveryValid) {
          // Error is handled by component
        } else {
          const prices = {
            items_total: formatCurrency(itemsTotalPrice, storedCurrency, currencyRates),
            shipping_total: formatCurrency(deliveryPrice, storedCurrency, currencyRates),
            total: formatCurrency(totalPrice, storedCurrency, currencyRates)
          }
          handleSubmit(shippingLines, prices);
        }
      }
    }
  }, [waitProductsCheck, productsLoading, activeOverlays, deliveryValid, shippingLines, deliveryPrice, itemsTotalPrice, totalPrice, handleSubmit, setWaitProductsCheck]);

  return {
    // Data
    cartItems,
    clientData,
    deliveryAddress,
    storedCurrency,
    currencyRates,
    // Delivery
    deliveryPrice,
    deliveryValid,
    setDeliveryValid,
    setShippingCost,
    shippingLines,
    // Totals
    itemsTotalPrice,
    totalPrice,
    formatCurrency: (amount: number) =>
      formatCurrency(amount, storedCurrency, currencyRates),
    // Actions
    clearCartItems,
    setClientData,
    setDeliveryAddress,
    setStoredCurrency,
    handlePushOrder,
    handleSubmit,
    handleProductsCheckComplete,
    isOrderLoading,
    isPending,
    isCartEmpty: cartItems.length === 0,
    // Product validation
    refreshProducts,
    setRefreshProducts,
    productsLoading,
    setProductsLoading,
    waitProductsCheck,
    setWaitProductsCheck,
    // Overlays
    activeOverlays,
    registerOverlay,
    unregisterOverlay,
    customerValid,
    setCustomerValid,
  };
}

