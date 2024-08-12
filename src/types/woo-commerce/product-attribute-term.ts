export interface ProductAttributeTerm {
  id: number; // Unique identifier for the resource (read-only).
  name: string; // Term name (mandatory).
  slug: string; // An alphanumeric identifier for the resource unique to its type.
  description: string; // HTML description of the resource.
  menu_order: number; // Menu order, used to custom sort the resource.
  count: number; // Number of published products for the resource.
}
