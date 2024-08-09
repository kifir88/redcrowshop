export interface ProductCategory {
  id: number; // Unique identifier for the resource (read-only).
  name: string; // Category name (mandatory).
  slug: string; // An alphanumeric identifier for the resource unique to its type.
  parent: number; // The ID for the parent of the resource.
  description: string; // HTML description of the resource.
  display: 'default' | 'products' | 'subcategories' | 'both'; // Category archive display type. Default is default.
  image?: ProductCategoryImage; // Image data (optional).
  menu_order: number; // Menu order, used to custom sort the resource.
  count: number; // Number of published products for the resource (read-only).
}

export interface ProductCategoryImage {
  id: number; // Image ID.
  date_created: string; // The date the image was created, in the site's timezone (read-only).
  date_created_gmt: string; // The date the image was created, as GMT (read-only).
  date_modified: string; // The date the image was last modified, in the site's timezone (read-only).
  date_modified_gmt: string; // The date the image was last modified, as GMT (read-only).
  src: string; // Image URL.
  name: string; // Image name.
  alt: string; // Image alternative text.
}
