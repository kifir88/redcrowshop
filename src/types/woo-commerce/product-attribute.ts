export interface ProductAttribute {
  id: number; // Unique identifier for the resource (read-only).
  name: string; // Attribute name (mandatory).
  slug: string; // An alphanumeric identifier for the resource unique to its type.
  type: string; // Type of attribute. By default only select is supported.
  order_by: 'menu_order' | 'name' | 'name_num' | 'id'; // Default sort order. Default is menu_order.
  has_archives: boolean; // Enable/Disable attribute archives. Default is false.
}
