"use client";

import { useLocalStorage } from "usehooks-ts";
import { CartItem } from "@/types/cart";
import { ClientData } from "@/types/client_data";
import { AddressResult } from "@/components/ui/address-map";
import { CurrencyType } from "@/libs/currency-helper";

interface CartStorage {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  clearCartItems: () => void;
  removeCartItem: (productId: number, productVariationId: number) => void;
  updateCartItemQuantity: (
    productId: number,
    productVariationId: number,
    quantity: number
  ) => void;
}

interface ClientDataStorage {
  clientData: ClientData;
  setClientData: (data: ClientData) => void;
}

interface AddressStorage {
  deliveryAddress: AddressResult;
  setDeliveryAddress: (address: AddressResult) => void;
}

interface CurrencyStorage {
  storedCurrency: CurrencyType;
  setStoredCurrency: (currency: CurrencyType) => void;
}

export function useCartStorage(): CartStorage {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("cartItems", []);

  const clearCartItems = () => setCartItems([]);

  const removeCartItem = (productId: number, productVariationId: number) => {
    const updatedItems = cartItems.filter(
      (item) =>
        !(
          item.productVariationId === productVariationId ||
          (item.productVariationId === -1 && item.productId === productId)
        )
    );
    setCartItems(updatedItems);
  };

  const updateCartItemQuantity = (
    productId: number,
    productVariationId: number,
    quantity: number
  ) => {
    const updatedItems = cartItems.map((ci) =>
      (ci.productVariationId === productVariationId &&
        productVariationId !== -1) ||
      (ci.productVariationId === -1 && ci.productId === productId)
        ? { ...ci, quantity }
        : ci
    );
    setCartItems(updatedItems);
  };

  return {
    cartItems,
    setCartItems,
    clearCartItems,
    removeCartItem,
    updateCartItemQuantity,
  };
}

export function useClientDataStorage(): ClientDataStorage {
  const [clientData, setClientData] =
    useLocalStorage<ClientData>("client_data", {} as ClientData);

  return { clientData, setClientData };
}

export function useDeliveryAddressStorage(): AddressStorage {
  const [deliveryAddress, setDeliveryAddress] =
    useLocalStorage<AddressResult>("customer_address", {} as AddressResult);

  return { deliveryAddress, setDeliveryAddress };
}

export function useCurrencyStorage(): CurrencyStorage {
  const [storedCurrency, setStoredCurrency] =
    useLocalStorage<CurrencyType>("currency", "KZT");

  return { storedCurrency, setStoredCurrency };
}

