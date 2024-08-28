interface Localization {
  data: any[]; // Assuming there are no localizations, adjust this type as needed when localization data is present.
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

interface Data {
  id: number;
  attributes: Attributes;
}

export interface StrapiPageApiResponse {
  data: Data;
  meta: Record<string, any>; // Meta is currently an empty object, so adjust the type if more specific fields are present.
}
