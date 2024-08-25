import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {Order} from "@/types/woo-commerce/order";
import {AxiosError, AxiosResponse} from "axios";
import {wooCommerceApiInstance} from "@/libs/woocommerce-rest-api";

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
}

interface ShippingLine {
  method_id: string;
  method_title: string;
  total: string;
}

interface OrderCreate {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: Address;
  shipping: Address;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
}

export default function useCreateOrder(): UseMutationResult<
  AxiosResponse<Order>,
  AxiosError,
  OrderCreate
> {
  const mutationFn = (payload: OrderCreate) => {
    return wooCommerceApiInstance.post("orders", payload)
  }

  return useMutation({
    mutationFn,
  })
}