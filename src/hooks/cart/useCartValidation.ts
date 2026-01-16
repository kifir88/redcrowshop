/**
 * Cart Validation Hook
 * Управляет состояниями валидации корзины
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useClientDataStorage } from "./useCartStorage";
import { CartItem } from "@/types/cart";

// Тип для setProductsLoading как в компонентах - только функция обратного вызова
type SetStateFn = (n: (prev: number) => number) => void;

interface UseCartValidationProps {
  cartItems: CartItem[];
}

export function useCartValidation({ cartItems }: UseCartValidationProps) {
  // Client validation
  const { clientData } = useClientDataStorage();
  const [customerValid, setCustomerValid] = useState<boolean>(false);

  // Product validation state
  const [refreshProducts, setRefreshProducts] = useState<number>(0);
  const [productsLoading, setProductsLoading] = useState<number>(0);
  const [waitProductsCheck, setWaitProductsCheck] = useState<boolean>(false);

  // Effect to validate customer data
  useEffect(() => {
    if (clientData.email) {
      setCustomerValid(true);
    }
  }, [clientData.email]);

  return {
    // Customer validation
    customerValid,
    setCustomerValid,
    
    // Product validation
    refreshProducts,
    setRefreshProducts: setRefreshProducts as SetStateFn,
    productsLoading,
    setProductsLoading: setProductsLoading as SetStateFn,
    waitProductsCheck,
    setWaitProductsCheck,
  };
}

