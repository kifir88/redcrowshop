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