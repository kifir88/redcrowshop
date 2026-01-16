/**
 * Cart Delivery Hook
 * Управляет логикой доставки и способами доставки
 */

"use client";

import { useState, useCallback } from "react";
import { DeliveryMethod, DeliveryOption } from "@/types/delivery";
import { ShippingLine } from "@/types/cart";
import { deliveryMethods } from "@/components/pages/cart/shipping_dialog";

export function useCartDelivery() {
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [deliveryValid, setDeliveryValid] = useState<boolean>(false);
  const [shippingLines, setShippingLines] = useState<ShippingLine[]>([]);

  // Calculate shipping cost based on delivery method and option
  const setShippingCost = useCallback(
    (method: DeliveryMethod, option: DeliveryOption | null) => {
      let price = 0;
      let lines: ShippingLine[] = [];

      switch (method) {
        case 'cdek':
          if (option) {
            price = option.delivery_sum;
            lines = [
              {
                method_id: "cdek",
                method_title: `[${option.tariff_code}] ${option.tariff_name}`,
                total: option.delivery_sum,
              },
            ];
          }
          break;

        case 'self_showroom':
        case 'self_storage':
        case 'dhl':
          price = 0;
          lines = [
            {
              method_id: method,
              method_title: deliveryMethods[method],
              total: '0.00',
            },
          ];
          break;

        default:
          price = 0;
          lines = [];
      }

      setDeliveryPrice(price);
      setShippingLines(lines);
    },
    []
  );

  return {
    // State
    deliveryPrice,
    deliveryValid,
    shippingLines,
    
    // Setters
    setDeliveryValid,
    setShippingCost,
  };
}

