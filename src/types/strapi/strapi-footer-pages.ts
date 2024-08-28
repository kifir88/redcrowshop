interface Localization {
  data: any[];
}

interface Attributes {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  name: string;
  content: string;
  slug: string;
  localizations: Localization;
}

interface DataItem {
  id: number;
  attributes: Attributes;
}

export interface StrapiFooterPagesApiResponse {
  data: DataItem[];
}
