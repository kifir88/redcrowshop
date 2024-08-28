interface ImageFormats {
  thumbnail: Format;
  small: Format;
  medium: Format;
  large: Format;
}

interface Format {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

interface ImageAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: ImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ImageData {
  id: number;
  attributes: ImageAttributes;
}

interface Image {
  data: ImageData;
}

interface Localization {
  data: any[]; // Adjust type if specific structure exists
}

export interface StrapiSliderAttributes {
  title: string;
  heading: string;
  description: string;
  bgHexColor: string;
  btnContent: string;
  btnTextColor: string;
  isLeft: boolean;
  textHexColor1: string;
  textHexColor2: string;
  href: string;
  hasBlurOnMobile: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  btnColor: string;
  locale: string;
  image: Image;
  localizations: Localization;
}

interface Item {
  id: number;
  attributes: StrapiSliderAttributes;
}

interface Meta {
  pagination: Pagination;
}

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiSliderApiResponse {
  data: Item[];
  meta: Meta;
}
