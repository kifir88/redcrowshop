'use server'

import { wooCommerceApiInstance } from "@/libs/woocommerce-rest-api";
import { after } from "next/server";
import { orderEmail } from "./email";
import axios from "axios";

interface OrderError {
  message?: string;
  data?: {
    message?: string;
  };
}

export async function createOrder(payload: any) {
  try {
    const response = await wooCommerceApiInstance.post("orders", payload);

    after(async () => {
      orderEmail(payload,response.data)
    
    });



    return { data: response.data, success: true };
  } catch (error: any) {
    // Извлекаем понятное сообщение об ошибке
    let errorMessage = "Произошла ошибка при создании заказа";

    if (error.response?.data?.message) {
      // WooCommerce часто возвращает ошибку в response.data.message
      errorMessage = error.response.data.message;
    } else if (error.message) {
      // Fallback на сообщение из error
      errorMessage = error.message;
    }

    // Логируем полную ошибку для отладки
    console.error("Create order error:", error);

    return { error: errorMessage, success: false };
  }
}
