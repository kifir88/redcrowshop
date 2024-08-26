import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Order } from "@/types/woo-commerce/order";

interface Payload {
  order: Order;
}

export default function useYookassaCreatePayment() {
  const mutationFn = async (payload: Payload) => {
    return axios.post("/api/yookassa-payment", payload);
  };

  return useMutation({
    mutationFn,
  });
}
