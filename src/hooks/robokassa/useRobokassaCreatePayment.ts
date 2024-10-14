import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Order } from "@/types/woo-commerce/order";

interface Payload {
  order: Order;
}

export default function useRobokassaCreatePayment() {
  const mutationFn = (payload: Payload) => {
    return axios.post("/api/robokassa", payload);
  };

  return useMutation({
    mutationFn,
  });
}
