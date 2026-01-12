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
import { createOrder } from "@/app/actions/order";

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
  prices: {
    items_total: string,
    shipping_total: string,
    total: string
  }
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
  name: string;
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
  deliveryAddress: any;
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
    mutationFn: async (payload: OrderCreate) => {
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

      const result = await createOrder(payload);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onError: (error: any) => {
      console.error("Create order error:", error);


      toast.error(error.message || "Ошибка при создании заказа");
    },
    onSuccess: async (res: any, variables: OrderCreate) => {
      clearCartItems();

      const orderToken = variables.order_token;

      const order_page = `/orders/${res.data.id}?order_token=${orderToken}`;

      router.push(order_page);
      toast.success(`Заказ успешно создан, переадресация на страницу оплаты`, {
        duration: 1000 * 10
      });
    },
  });

  const handleSubmit = useCallback(
    async (shippingLines: ShippingLine[], prices: any) => {
      const orderToken = uuidv4();


      const address_info = {
        city: deliveryAddress.city.name,
        state: deliveryAddress.region.name,
        country: deliveryAddress.country.name,
        postcode: deliveryAddress.postcode,
      }

      const address = {
        ...clientData,
        ...address_info,
        phone: formatPhoneNumberIntl(clientData.phone as string),
        address_1: deliveryAddress.street,
      };

      const lineItems = cartItems.map((ci) =>
        ci.productVariationId !== -1
          ? {
            name: ci.name,
            product_id: ci.productId,
            variation_id: ci.productVariationId,
            quantity: ci.quantity,
            price: Math.round(
              amountCurrency(ci.price, 'KZT', currencyRates)
            ),
          }
          : {
            name: ci.name,
            product_id: ci.productId,
            quantity: ci.quantity,
            price: Math.round(
              amountCurrency(ci.price, 'KZT', currencyRates)
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
            'KZT',
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
        currency: 'KZT',
        customer_note: "",
        order_token: orderToken,
        prices
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

