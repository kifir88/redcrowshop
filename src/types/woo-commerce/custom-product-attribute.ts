export interface CustomProductAttribute {
  id: number;
  name: string;
  slug: string;
  options: {
    term_id: number;
    slug: string;
    name: string;
  }[];
}
