/**
 * Cart Totals Hook
 * Управляет расчётом цен и итогов корзины
 */

"use client";

import { useMemo, useCallback } from "react";
import { CartItem } from "@/types/cart";
import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";

interface UseCartTotalsProps {
  cartItems: CartItem[];
  storedCurrency: CurrencyType;
  currencyRates: CustomCurrencyRates;
  deliveryPrice: number;
}

export function useCartTotals({
  cartItems,
  storedCurrency,
  currencyRates,
  deliveryPrice,
}: UseCartTotalsProps) {
  // Calculate items total price (sum of all items)
  const itemsTotalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  // Calculate total price (items + delivery)
  const totalPrice = useMemo(
    () => itemsTotalPrice + deliveryPrice,
    [itemsTotalPrice, deliveryPrice]
  );

  // Format currency helper
  const formatPrice = useCallback(
    (amount: number) => formatCurrency(amount, storedCurrency, currencyRates),
    [storedCurrency, currencyRates]
  );

  return {
    // Calculated totals
    itemsTotalPrice,
    totalPrice,
    deliveryPrice,
    
    // Helpers
    formatPrice,
    
    // Computed states
    isCartEmpty: cartItems.length === 0,
  };
}

