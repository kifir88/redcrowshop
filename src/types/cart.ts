export interface CartItem {
  productId: number;
  productVariationId: number;
  product_url: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string | null;
  imageAlt: string | null;
  attributes: string[];
}

// Типы для доставки
export interface DeliveryOption {
  calendar_max: number;
  calendar_min: number;
  delivery_date_range: {
    min: string;
    max: string;
  };
  delivery_mode: number;
  delivery_sum: number;
  period_max: number;
  period_min: number;
  tariff_code: number;
  tariff_description: string;
  tariff_name: string;
}

export type DeliveryMethod = "self" | "cdek";

// Типы для оформления заказа
export interface ShippingLine {
  method_id: string;
  method_title: string;
  total: number | string;
}

export interface Address {
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

export interface LineItem {
  product_id: number;
  variation_id?: number;
  quantity: number;
  price: number;
}

export interface OrderMetaData {
  key: string;
  value: string;
}

export interface OrderCreate {
  payment_method: string;
  payment_method_title: string;
  customer_note: string;
  set_paid: boolean;
  billing: Address;
  shipping: Address;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
  meta_data?: OrderMetaData[];
  currency: string;
}

