/**
 * Main Cart Hook
 * Компонует все вспомогательные хуки корзины
 * 
 * @example
 * const {
 *   cart,
 *   totals,
 *   delivery,
 *   validation,
 *   checkout,
 *   overlays
 * } = useCart({ currencyRates });
 */

"use client";

import { useCallback, useTransition } from "react";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import { CurrencyType } from "@/libs/currency-helper";
import { ShippingLine } from "@/types/cart";

import { useCartStorage } from "./useCartStorage";
import { useClientDataStorage } from "./useCartStorage";
import { useDeliveryAddressStorage } from "./useCartStorage";
import { useCurrencyStorage } from "./useCartStorage";

import { useCartTotals } from "./useCartTotals";
import { useCartDelivery } from "./useCartDelivery";
import { useCartValidation } from "./useCartValidation";
import { useCartOverlays } from "./useCartOverlays";
import { useCartOrder } from "./useCartOrder";

interface UseCartProps {
  currencyRates: CustomCurrencyRates;
}

// Результат основного хука - сгруппированные возвращаемые значения
export interface UseCartResult {
  // Cart data
  cart: {
    items: ReturnType<typeof useCartStorage>["cartItems"];
    clearCart: ReturnType<typeof useCartStorage>["clearCartItems"];
    setCartItems: ReturnType<typeof useCartStorage>["setCartItems"];
  };
  
  // Client data
  client: {
    data: ReturnType<typeof useClientDataStorage>["clientData"];
    setData: ReturnType<typeof useClientDataStorage>["setClientData"];
    address: ReturnType<typeof useDeliveryAddressStorage>["deliveryAddress"];
    setAddress: ReturnType<typeof useDeliveryAddressStorage>["setDeliveryAddress"];
    currency: CurrencyType;
    setCurrency: ReturnType<typeof useCurrencyStorage>["setStoredCurrency"];
  };
  
  // Totals and prices
  totals: {
    itemsTotalPrice: number;
    totalPrice: number;
    formatPrice: (amount: number) => string;
    isCartEmpty: boolean;
  };
  
  // Delivery
  delivery: {
    deliveryPrice: number;
    deliveryValid: boolean;
    setDeliveryValid: (valid: boolean) => void;
    setShippingCost: (method: any, option: any) => void;
    shippingLines: ShippingLine[];
  };
  
  // Validation
  validation: {
    customerValid: boolean;
    setCustomerValid: (valid: boolean) => void;
    refreshProducts: number;
    setRefreshProducts: (fn: (prev: number) => number) => void;
    productsLoading: number;
    setProductsLoading: (fn: (prev: number) => number) => void;
    waitProductsCheck: boolean;
    setWaitProductsCheck: (value: boolean) => void;
  };
  
  // Overlays
  overlays: {
    activeOverlays: number;
    registerOverlay: () => void;
    unregisterOverlay: () => void;
    hasActiveOverlays: boolean;
  };
  
  // Checkout
  checkout: {
    handlePushOrder: () => void;
    handleSubmit: (lines: ShippingLine[], prices: any) => void;
    handleProductsCheckComplete: () => void;
    isOrderLoading: boolean;
    isPending: boolean;
  };
  
  // Direct access to raw hooks (for backwards compatibility)
  _hooks: {
    cartStorage: ReturnType<typeof useCartStorage>;
    clientStorage: ReturnType<typeof useClientDataStorage>;
    addressStorage: ReturnType<typeof useDeliveryAddressStorage>;
    currencyStorage: ReturnType<typeof useCurrencyStorage>;
    totals: ReturnType<typeof useCartTotals>;
    delivery: ReturnType<typeof useCartDelivery>;
    validation: ReturnType<typeof useCartValidation>;
    overlays: ReturnType<typeof useCartOverlays>;
    order: ReturnType<typeof useCartOrder>;
  };
}

export function useCart({ currencyRates }: UseCartProps): UseCartResult {
  // Storage hooks
  const cartStorage = useCartStorage();
  const clientStorage = useClientDataStorage();
  const addressStorage = useDeliveryAddressStorage();
  const currencyStorage = useCurrencyStorage();
  
  // Feature hooks
  const delivery = useCartDelivery();
  
  const validation = useCartValidation({
    cartItems: cartStorage.cartItems,
  });
  
  const overlays = useCartOverlays();
  
  const [isPending] = useTransition();
  
  // Update totals with actual delivery price
  const totalsWithDelivery = useCartTotals({
    cartItems: cartStorage.cartItems,
    storedCurrency: currencyStorage.storedCurrency,
    currencyRates,
    deliveryPrice: delivery.deliveryPrice,
  });
  
  // Order hook
  const order = useCartOrder({
    cartItems: cartStorage.cartItems,
    clientData: clientStorage.clientData,
    deliveryAddress: addressStorage.deliveryAddress,
    storedCurrency: currencyStorage.storedCurrency,
    currencyRates,
    clearCartItems: cartStorage.clearCartItems,
  });

  // Handle order creation
  const handlePushOrder = useCallback(() => {
    validation.setProductsLoading((prev) => prev + cartStorage.cartItems.length);
    validation.setRefreshProducts((prev) => prev + 1);
    validation.setWaitProductsCheck(true);
  }, [cartStorage.cartItems.length, validation]);

  // Handle product check completion - used by cart-content
  const handleProductsCheckComplete = useCallback(() => {
    if (validation.waitProductsCheck && validation.productsLoading === 0) {
      validation.setWaitProductsCheck(false);

      if (overlays.activeOverlays === 0) {
        if (!delivery.deliveryValid) {
          // Error is handled by component
        } else {
          const prices = {
            items_total: totalsWithDelivery.formatPrice(totalsWithDelivery.itemsTotalPrice),
            shipping_total: totalsWithDelivery.formatPrice(delivery.deliveryPrice),
            total: totalsWithDelivery.formatPrice(totalsWithDelivery.totalPrice),
          };
          order.handleSubmit(delivery.shippingLines, prices);
        }
      }
    }
  }, [
    validation.waitProductsCheck,
    validation.productsLoading,
    overlays.activeOverlays,
    delivery.deliveryValid,
    delivery.shippingLines,
    delivery.deliveryPrice,
    totalsWithDelivery,
    order.handleSubmit,
    validation.setWaitProductsCheck,
  ]);

  return {
    // Cart data
    cart: {
      items: cartStorage.cartItems,
      clearCart: cartStorage.clearCartItems,
      setCartItems: cartStorage.setCartItems,
    },
    
    // Client data
    client: {
      data: clientStorage.clientData,
      setData: clientStorage.setClientData,
      address: addressStorage.deliveryAddress,
      setAddress: addressStorage.setDeliveryAddress,
      currency: currencyStorage.storedCurrency,
      setCurrency: currencyStorage.setStoredCurrency,
    },
    
    // Totals
    totals: {
      itemsTotalPrice: totalsWithDelivery.itemsTotalPrice,
      totalPrice: totalsWithDelivery.totalPrice,
      formatPrice: totalsWithDelivery.formatPrice,
      isCartEmpty: totalsWithDelivery.isCartEmpty,
    },
    
    // Delivery
    delivery: {
      deliveryPrice: delivery.deliveryPrice,
      deliveryValid: delivery.deliveryValid,
      setDeliveryValid: delivery.setDeliveryValid,
      setShippingCost: delivery.setShippingCost,
      shippingLines: delivery.shippingLines,
    },
    
    // Validation
    validation: {
      customerValid: validation.customerValid,
      setCustomerValid: validation.setCustomerValid,
      refreshProducts: validation.refreshProducts,
      setRefreshProducts: validation.setRefreshProducts,
      productsLoading: validation.productsLoading,
      setProductsLoading: validation.setProductsLoading,
      waitProductsCheck: validation.waitProductsCheck,
      setWaitProductsCheck: validation.setWaitProductsCheck,
    },
    
    // Overlays
    overlays: {
      activeOverlays: overlays.activeOverlays,
      registerOverlay: overlays.registerOverlay,
      unregisterOverlay: overlays.unregisterOverlay,
      hasActiveOverlays: overlays.hasActiveOverlays,
    },
    
    // Checkout
    checkout: {
      handlePushOrder,
      handleSubmit: order.handleSubmit,
      handleProductsCheckComplete,
      isOrderLoading: order.isLoading,
      isPending,
    },
    
    // Raw hooks (for migration and advanced use cases)
    _hooks: {
      cartStorage,
      clientStorage,
      addressStorage,
      currencyStorage,
      totals: totalsWithDelivery,
      delivery,
      validation,
      overlays,
      order,
    },
  };
}

