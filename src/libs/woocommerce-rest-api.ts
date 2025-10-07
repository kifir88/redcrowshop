import WooCommerceRestApi, { type IWooCommerceRestApiOptions } from "@woocommerce/woocommerce-rest-api";import {type AxiosResponse} from "axios";
import {Product} from "@/types/woo-commerce/product";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import {ProductAttribute} from "@/types/woo-commerce/product-attribute";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {CustomProductAttribute} from "@/types/woo-commerce/custom-product-attribute";
import {Order} from "@/types/woo-commerce/order";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import redis from "./redis";

const options: IWooCommerceRestApiOptions = {
  url: "https://admin.redcrow.kz/",
  consumerKey: "ck_901883160cd3f891e2eaa4b88e28b4b0198c9682",
  consumerSecret: "cs_8b64a8187c67dbeb6e0ccf618069d0b69b4dd690",
  version: "wc/v3",
  axiosConfig: {
    headers: {
      "Content-type": "application/json"
    }
  }
};
const custom_v1_options: IWooCommerceRestApiOptions = {
  url: "https://admin.redcrow.kz/",
  consumerKey: "ck_901883160cd3f891e2eaa4b88e28b4b0198c9682",
  consumerSecret: "cs_8b64a8187c67dbeb6e0ccf618069d0b69b4dd690",
  version: "custom/v1" as any,
  axiosConfig: {
    headers: {
      "Content-type": "application/json"
    }
  }
};
const custom_api_v1_options: IWooCommerceRestApiOptions = {
  url: "https://admin.redcrow.kz/",
  consumerKey: "ck_901883160cd3f891e2eaa4b88e28b4b0198c9682",
  consumerSecret: "cs_8b64a8187c67dbeb6e0ccf618069d0b69b4dd690",
  version: "custom-api/v1" as any,
  axiosConfig: {
    headers: {
      "Content-type": "application/json"
    }
  }

};
const cust_api_v1_options: IWooCommerceRestApiOptions = {
  url: "https://admin.redcrow.kz/",
  consumerKey: "ck_901883160cd3f891e2eaa4b88e28b4b0198c9682",
  consumerSecret: "cs_8b64a8187c67dbeb6e0ccf618069d0b69b4dd690",
  version: "cust_api/v1" as any,
  axiosConfig: {
    headers: {
      "Content-type": "application/json"
    }
  }
};

export const wooCommerceApiInstance = new WooCommerceRestApi(options);
export const wooCommerceCustomV1ApiInstance = new WooCommerceRestApi(custom_v1_options);
export const wooCommerceCustomApiV1ApiInstance = new WooCommerceRestApi(custom_api_v1_options);
export const wooCommerceCustApiV1ApiInstance = new WooCommerceRestApi(cust_api_v1_options);

// API cust_api/v1

export const fetchCurrencyRates = (): Promise<AxiosResponse<CustomCurrencyRates>> => {
  return wooCommerceCustApiV1ApiInstance.get("cur_rates")
}

const CACHE_TTL_SECONDS = 60 * 5; // 5 min

// API custom/v1

// With REDIS cache
export async function fetchCustomProductAttributes(params?: any): Promise<CustomProductAttribute[]> {

    console.log(JSON.stringify(params));

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
    console.log("fetching product-attributes via redis ");
    const res = await fetch(`/api/redis/product-attributes?${search.toString()}`, { cache: "no-store" });

    console.log("after fetch 1");
    const raw = await res.json();
    const attrs = raw as CustomProductAttribute[];

    return attrs;
}

export const fetchCustomProductCategoryMaxPrice = (productCategorySlug: string) => {
  return wooCommerceCustomApiV1ApiInstance.get(`max-price?category_slug=${productCategorySlug}`)
}

// API wc/v3

export const fetchProducts = (params?: any): Promise<AxiosResponse<Product[]>> => {
  const cacheBuster = { _timestamp: new Date().getTime() };
  const defaultParams = { ...params, status: 'publish', ...cacheBuster };
  return wooCommerceApiInstance.get("products?"+new Date().getTime(), defaultParams)
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
export const fetchProductAttributeTerms = (
    attributeId: string,
    params?: any
): Promise<AxiosResponse<ProductAttributeTerm[]>> => {

  return wooCommerceApiInstance.get(
      `products/attributes/${attributeId}/terms?per_page=100`,
      { params: params } // Pass the merged parameters
  );
};

export const fetchProductVariations = (productId: number, params?: any): Promise<AxiosResponse<ProductVariation[]>> => {
  const defaultParams = { ...params, status: 'publish' };
  return wooCommerceApiInstance.get(`products/${productId}/variations`, params)
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