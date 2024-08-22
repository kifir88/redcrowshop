export interface ProductVariation {
  id: number; // read-only
  date_created: string; // date-time, read-only
  date_created_gmt: string; // date-time, read-only
  date_modified: string; // date-time, read-only
  date_modified_gmt: string; // date-time, read-only
  description: string;
  permalink: string; // read-only
  sku: string;
  price: string; // read-only
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null; // date-time
  date_on_sale_from_gmt: string | null; // date-time
  date_on_sale_to: string | null; // date-time
  date_on_sale_to_gmt: string | null; // date-time
  on_sale: boolean; // read-only
  status: 'draft' | 'pending' | 'private' | 'publish'; // default is publish
  purchasable: boolean; // read-only
  virtual: boolean; // default is false
  downloadable: boolean; // default is false
  downloads: Download[];
  download_limit: number; // default is -1
  download_expiry: number; // default is -1
  tax_status: 'taxable' | 'shipping' | 'none'; // default is taxable
  tax_class: string;
  manage_stock: boolean; // default is false
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder'; // default is instock
  backorders: 'no' | 'notify' | 'yes'; // default is no
  backorders_allowed: boolean; // read-only
  backordered: boolean; // read-only
  weight: string;
  dimensions: Dimensions;
  shipping_class: string;
  shipping_class_id: string; // read-only
  image: Image | null;
  attributes: Attribute[];
  menu_order: number;
  meta_data: MetaData[];
}

export interface Download {
  id: string;
  name: string;
  file: string;
}

export interface Dimensions {
  length: string;
  width: string;
  height: string;
}

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

export interface Attribute {
  id: number;
  name: string;
  option: string;
}

export interface MetaData {
  id: number; // read-only
  key: string;
  value: string;
}
