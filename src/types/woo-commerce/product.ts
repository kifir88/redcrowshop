// Product Dimensions Interface
export interface Dimensions {
  length: string;
  width: string;
  height: string;
}

// Product Download Properties Interface
export interface Download {
  id: string;
  name: string;
  file: string;
}

// Product Categories Properties Interface
export interface Category {
  id: number;
  name: string; // read-only
  slug: string; // read-only
}

// Product Tags Properties Interface
export interface Tag {
  id: number;
  name: string; // read-only
  slug: string; // read-only
}

// Product Images Properties Interface
export interface Image {
  id: number;
  date_created: string; // date-time, read-only
  date_created_gmt: string; // date-time, read-only
  date_modified: string; // date-time, read-only
  date_modified_gmt: string; // date-time, read-only
  src: string;
  name: string;
  alt: string;
}

// Product Attributes Properties Interface
export interface Attribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

// Product Default Attributes Properties Interface
export interface DefaultAttribute {
  id: number;
  name: string;
  option: string;
}

// Product Meta Data Properties Interface
export interface MetaData {
  id: number; // read-only
  key: string;
  value: string;
}

// Main Product Interface
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string; // read-only
  date_created: string; // date-time, read-only
  date_created_gmt: string; // date-time, read-only
  date_modified: string; // date-time, read-only
  date_modified_gmt: string; // date-time, read-only
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string; // read-only
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null; // date-time
  date_on_sale_from_gmt: string | null; // date-time
  date_on_sale_to: string | null; // date-time
  date_on_sale_to_gmt: string | null; // date-time
  price_html: string; // read-only
  on_sale: boolean; // read-only
  purchasable: boolean; // read-only
  total_sales: number; // read-only
  virtual: boolean;
  downloadable: boolean;
  downloads: Download[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean; // read-only
  backordered: boolean; // read-only
  sold_individually: boolean;
  weight: string;
  dimensions: Dimensions;
  shipping_required: boolean; // read-only
  shipping_taxable: boolean; // read-only
  shipping_class: string;
  shipping_class_id: number; // read-only
  reviews_allowed: boolean;
  average_rating: string; // read-only
  rating_count: number; // read-only
  related_ids: number[]; // read-only
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Category[];
  tags: Tag[];
  images: Image[];
  attributes: Attribute[];
  default_attributes: DefaultAttribute[];
  variations: number[]; // read-only
  grouped_products: number[];
  menu_order: number;
  meta_data: MetaData[];
}
