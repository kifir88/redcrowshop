import WooCommerceRestApi, { type WooCommerceRestApiOptions } from "@woocommerce/woocommerce-rest-api";
import {type AxiosResponse} from "axios";
import {Product} from "@/types/woo-commerce/product";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import {ProductAttribute} from "@/types/woo-commerce/product-attribute";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {CustomProductAttribute} from "@/types/woo-commerce/custom-product-attribute";

const options: WooCommerceRestApiOptions = {
  url: "https://admin.redcrow.kz/",
  consumerKey: "ck_901883160cd3f891e2eaa4b88e28b4b0198c9682",
  consumerSecret: "cs_8b64a8187c67dbeb6e0ccf618069d0b69b4dd690",
  version: "wc/v3",
};
const custom_v1_options: WooCommerceRestApiOptions = {
  url: "https://admin.redcrow.kz/",
  consumerKey: "ck_901883160cd3f891e2eaa4b88e28b4b0198c9682",
  consumerSecret: "cs_8b64a8187c67dbeb6e0ccf618069d0b69b4dd690",
  version: "custom/v1" as any,
};

export const wooCommerceApiInstance = new WooCommerceRestApi(options);
export const wooCommerceCustomV1ApiInstance = new WooCommerceRestApi(custom_v1_options);

// API custom/v1

export const fetchCustomProductAttributes = (params?: any): Promise<AxiosResponse<CustomProductAttribute[]>> => {
  return wooCommerceCustomV1ApiInstance.get("product-attributes", params)
}

// API wc/v3

export const fetchProducts = (params?: any): Promise<AxiosResponse<Product[]>> => {
  return wooCommerceApiInstance.get("products", params)
}
export const fetchProductCategories = (params?: any): Promise<AxiosResponse<ProductCategory[]>> => {
  return wooCommerceApiInstance.get("products/categories", params)
}
export const fetchProductCategory = (productCategoryId: number) => {
  return wooCommerceApiInstance.get(`products/categories/${productCategoryId}`)
}
export const fetchProductAttributes = (params?: any): Promise<AxiosResponse<ProductAttribute[]>> => {
  return wooCommerceApiInstance.get("products/attributes", params)
}
export const fetchProductAttributeTerms = (attributeId: string, params?: any): Promise<AxiosResponse<ProductAttributeTerm[]>> => {
  return wooCommerceApiInstance.get(`products/attributes/${attributeId}/terms`, params)
}
export const fetchProductVariations = (productId: number, params?: any): Promise<AxiosResponse<ProductVariation[]>> => {
  return wooCommerceApiInstance.get(`products/${productId}/variations`, params)
}