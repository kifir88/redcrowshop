export interface CartItem {
  productVariationId: number;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
  attributes: string[]
}