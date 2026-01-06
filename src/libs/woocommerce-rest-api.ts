import WooCommerceRestApi, { type IWooCommerceRestApiOptions } from "@woocommerce/woocommerce-rest-api"; import { type AxiosResponse } from "axios";
import { Product, RedisCachedProducts } from "@/types/woo-commerce/product";
import { ProductCategory } from "@/types/woo-commerce/product-category";
import { ProductAttribute } from "@/types/woo-commerce/product-attribute";
import { ProductAttributeTerm } from "@/types/woo-commerce/product-attribute-term";
import { ProductVariation } from "@/types/woo-commerce/product-variation";
import { CustomProductAttribute } from "@/types/woo-commerce/custom-product-attribute";
import { Order } from "@/types/woo-commerce/order";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import redis from "./redis";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const endpoints = [
  'wc/v3',
  'custom/v1',
  'custom-api/v1',
  'cust_api/v1'
]

// #TODO Надо сократить количество endpointoв, тем более они не авторизуются корректно
export const [
  wooCommerceApiInstance,
  wooCommerceCustomV1ApiInstance,
  wooCommerceCustomApiV1ApiInstance,
  wooCommerceCustApiV1ApiInstance,
] = endpoints.map(endpoint => new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WP_URL || '',
  consumerKey: process.env.WP_CONSUMER_KEY || '',
  consumerSecret: process.env.WP_CONSUMER_SECRET || '',
  version: endpoint as any,
  axiosConfig: {
    headers: {
      "Content-type": "application/json"
    }
  }
}))
// API cust_api/v1

export const fetchCurrencyRates = (): Promise<AxiosResponse<CustomCurrencyRates>> => {
  return wooCommerceCustApiV1ApiInstance.get("cur_rates")
}

const CACHE_TTL_SECONDS = 60 * 5; // 5 min

// API custom/v1

// With REDIS cache
export async function fetchCustomProductAttributes(params?: any, cached: boolean = true): Promise<CustomProductAttribute[]> {

  if (!cached) {
    const response = await wooCommerceCustomV1ApiInstance.get("product-attributes", params);
    const data = response.data
    return data as CustomProductAttribute[];
  }

  const search = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach(v => search.append(`${key}[]`, v));
    } else if (typeof value === "object" && value !== null) {
      search.append(key, JSON.stringify(value));
    } else {
      search.append(key, value);
    }
  }

  const res = await fetch(baseUrl + `/api/redis/product-attributes?${search.toString()}`, { cache: "no-store" });

  const raw = await res.json();
  const attrs = raw as CustomProductAttribute[];

  return attrs;
}

// API wc/v3
export async function fetchProducts(params?: any, cache: boolean = true): Promise<RedisCachedProducts> {

  // fetch from woocommerce if not cached by redis

  if (!cache) {
    const cacheBuster = { _timestamp: new Date().getTime() };
    const defaultParams = { ...params, status: 'publish', ...cacheBuster };


    // 2️⃣ Fetch from WooCommerce
    const response = await wooCommerceApiInstance.get("products?" + new Date().getTime(), defaultParams);
    const data = response.data

    const totalPages = response.headers["x-wp-totalpages"]

    return { totalPages: totalPages, data: data } as RedisCachedProducts;
  }

  const search = new URLSearchParams();
  for (const key in params) {
    const value = params[key];

    if (value === 'undefined' || value === undefined)
      continue;

    if (Array.isArray(value)) {
      value.forEach(v => search.append(`${key}[]`, v));
    } else if (typeof value === "object" && value !== null) {
      search.append(key, JSON.stringify(value));
    } else {
      search.append(key, value);
    }
  }

  const res = await fetch(baseUrl + `/api/redis/products?${search.toString()}`, { cache: "no-store" });

  const raw = await res.json();

  const products = raw as RedisCachedProducts;

  return products;
}

export const fetchCustomProductCategoryMaxPrice = (productCategorySlug: string) => {
  return wooCommerceCustomApiV1ApiInstance.get(`max-price?category_slug=${productCategorySlug}`)
}


export const fetchProductCustomCategories = async (params?: any): Promise<AxiosResponse<ProductCategory[]>> => {
  let cats = await wooCommerceCustomApiV1ApiInstance.get('categories')
  return cats;
}

export const fetchProductCategories = (params?: any): Promise<AxiosResponse<ProductCategory[]>> => {
  const cacheBuster = { _timestamp: new Date().getTime() };
  const defaultParams = { ...params, ...cacheBuster };
  return wooCommerceApiInstance.get("products/categories", defaultParams)
}
export const fetchProductCategory = (productCategoryId: number) => {
  return wooCommerceApiInstance.get(`products/categories/${productCategoryId}`)
}
export const fetchProductAttributes = (params?: any): Promise<AxiosResponse<ProductAttribute[]>> => {
  return wooCommerceApiInstance.get("products/attributes", params)
}
export const fetchProductAttributeTerms = async (
  attributeId: string,
  params?: any
): Promise<ProductAttributeTerm[]> => {

  const res = await fetch(baseUrl + `/api/redis/product-attribute-terms?attributeId=${attributeId}`, { cache: "no-store" });
  const raw = await res.json();

  return raw as ProductAttributeTerm[];
};

export const fetchProductVariations = async (productId: number, params?: any, cache: boolean = true): Promise<ProductVariation[]> => {
  const defaultParams = { ...params, status: 'publish' };

  const search = new URLSearchParams();
  for (const key in params) {
    const value = params[key];

    if (value === 'undefined' || value === undefined)
      continue;

    if (Array.isArray(value)) {
      value.forEach(v => search.append(`${key}[]`, v));
    } else if (typeof value === "object" && value !== null) {
      search.append(key, JSON.stringify(value));
    } else {
      search.append(key, value);
    }
  }

  search.append('productId', productId.toString());

  const res = await fetch(baseUrl + `/api/redis/product-variations?=${search.toString()}`, { cache: "no-store" });
  const raw = await res.json();

  return raw as ProductVariation[];
}

export const fetchProductVariation = (productId: number, variationId: number, params?: any): Promise<AxiosResponse<ProductVariation>> => {
  return wooCommerceApiInstance.get(`products/${productId}/variations/${variationId}`, params)
}
export const fetchProduct = (productId: number, params?: any): Promise<AxiosResponse<Product>> => {
  return wooCommerceApiInstance.get(`products/${productId}`, params)
}
export const fetchOrders = (params?: any): Promise<AxiosResponse<Order[]>> => {
  return wooCommerceApiInstance.get("orders", params)
}

// Define the expected type for meta_data
interface MetaData {
  key: string;
  value: string;
}

export const fetchOrder = async (orderId: string, orderToken: string): Promise<AxiosResponse<Order> | null> => {
  try {
    const response = await wooCommerceApiInstance.get(`orders/${orderId}`);
    const order = response.data;

    // Check if order token matches
    if (!order.meta_data) {
      return null;
    }

    const tokenMeta = order.meta_data.find((meta: MetaData) => meta.key === "order_token");
    const storedToken = tokenMeta ? tokenMeta.value : null;

    if (!storedToken || storedToken !== orderToken) {
      return null;
    }

    return response;

  } catch (error) {
    return null;
  }
};

export const fetchOrderServer = async (orderId: string): Promise<AxiosResponse<Order> | null> => {
  const response = await wooCommerceApiInstance.get(`orders/${orderId}`);
  return response;
};




export const updateOrder = (orderId: string, payload: any): Promise<AxiosResponse<Order>> => {
  return wooCommerceApiInstance.put(`orders/${orderId}`, payload)
}