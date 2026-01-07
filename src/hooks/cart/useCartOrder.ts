"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CartItem } from "@/types/cart";
import { ClientData } from "@/types/client_data";
import { CurrencyType } from "@/libs/currency-helper";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import { ShippingLine } from "@/types/cart";
import { AddressResult } from "@/components/ui/address-map";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { amountCurrency } from "@/libs/currency-helper";
import toast from "react-hot-toast";
import { Order } from "@/types/woo-commerce/order";
import { wooCommerceApiInstance } from "@/libs/woocommerce-rest-api";
import { v4 as uuidv4 } from "uuid";
import { error } from "console";

interface OrderCreate {
  payment_method: string;
  payment_method_title: string;
  customer_note: string;
  set_paid: boolean;
  billing: Address;
  shipping: Address;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
  meta_data?: OrderMetaData[];
  currency: CurrencyType;
  order_token?: string;
}

interface Address {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

interface LineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  price: number;
}

interface OrderMetaData {
  key: string;
  value: string;
}

interface UseCartOrderProps {
  cartItems: CartItem[];
  clientData: ClientData;
  deliveryAddress: AddressResult;
  storedCurrency: CurrencyType;
  currencyRates: CustomCurrencyRates;
  clearCartItems: () => void;
}

export function useCartOrder({
  cartItems,
  clientData,
  deliveryAddress,
  storedCurrency,
  currencyRates,
  clearCartItems,
}: UseCartOrderProps) {
  const router = useRouter();

  const createOrderMutation = useMutation({
    mutationFn: (payload: OrderCreate) => {
      const orderToken = payload.order_token || uuidv4();
      const storedData = localStorage.getItem("referral_code");

      if (storedData) {
        var { code, expires } = JSON.parse(storedData);
        if (Date.now() > expires) {
          code = null;
          localStorage.removeItem("referral_code");
        }
      }

      if (code) {
        payload.meta_data = [
          ...(payload.meta_data || []),
          { key: "referral_code", value: code },
          { key: "order_token", value: orderToken },
        ];

        payload.customer_note = `${payload.customer_note || ""} [Referral=${code}]`;
      } else {
        payload.meta_data = [
          ...(payload.meta_data || []),
          { key: "order_token", value: orderToken },
        ];
      }

      return wooCommerceApiInstance.post("orders", payload);
    },
    onError: (error: any) => {
      console.error(error, "create-order-error");
      toast.error(`${error.response?.data || "Ошибка при создании заказа"}`);
    },
    onSuccess: async (res: any, variables: OrderCreate) => {
      clearCartItems();

      const orderId = res.data.id;
      const orderToken = variables.order_token;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/custom/v1/reduce-stock`,
          { orderId }
        );
      } catch (err) {
        console.error("Failed to reduce stock", err);
      }

      router.push(`/orders/${res.data.id}?order_token=${orderToken}`);
      toast.success("Заказ успешно создан");
    },
  });

  const handleSubmit = useCallback(
    async (shippingLines: ShippingLine[]) => {
      const orderToken = uuidv4();
      
      const address = {
        ...clientData,
        ...deliveryAddress.address,
        phone: formatPhoneNumberIntl(clientData.phone as string),
        address_1: deliveryAddress.displayName,
      };

      const lineItems = cartItems.map((ci) =>
        ci.productVariationId !== -1
          ? {
            product_id: ci.productId,
            variation_id: ci.productVariationId,
            quantity: ci.quantity,
            price: Math.round(
              amountCurrency(ci.price, storedCurrency, currencyRates)
            ),
          }
          : {
            product_id: ci.productId,
            quantity: ci.quantity,
            price: Math.round(
              amountCurrency(ci.price, storedCurrency, currencyRates)
            ),
          }
      );

      const rawPriceFormatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const shipping_lines = shippingLines.map((item) => ({
        ...item,
        total: rawPriceFormatter.format(
          amountCurrency(
            typeof item.total === "string" ? parseFloat(item.total) : item.total,
            storedCurrency,
            currencyRates
          )
        ),
      }));

      const payload: OrderCreate = {
        payment_method: "",
        payment_method_title: "",
        set_paid: false,
        billing: address,
        shipping: address,
        line_items: lineItems,
        shipping_lines: shipping_lines,
        currency: storedCurrency,
        customer_note: "",
        order_token: orderToken,
      };

      createOrderMutation.mutate(payload);
    },
    [
      cartItems,
      clientData,
      deliveryAddress,
      storedCurrency,
      currencyRates,
      createOrderMutation,
    ]
  );

  return {
    handleSubmit,
    isLoading: createOrderMutation.isPending,
    isError: createOrderMutation.isError,
  };
}

