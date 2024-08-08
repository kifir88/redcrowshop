import WooCommerceRestApi, { type WooCommerceRestApiOptions } from "@woocommerce/woocommerce-rest-api";

const options: WooCommerceRestApiOptions = {
  url: "https://admin.redcrow.kz/",
  consumerKey: "ck_901883160cd3f891e2eaa4b88e28b4b0198c9682",
  consumerSecret: "cs_8b64a8187c67dbeb6e0ccf618069d0b69b4dd690",
  version: "wc/v3",
};

export const wooCommerceApiInstance = new WooCommerceRestApi(options);

export const fetchProducts = (params?: any) => {
  return wooCommerceApiInstance.get("products", params)
}
export const fetchProductCategories = (params?: any) => {
  return wooCommerceApiInstance.get("products/categories", params)
}