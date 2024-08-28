export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSlider {
  data: StrapiImage[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiImage {
  id: number,
  attributes: StarpiImageAttribute
}

export interface IStrapiResponse2<T> {
  data: { id: number; attributes: T }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface ICarouselSlideStrapiLocal {
  data: {
    id: number;
    attributes: {
      isLeft: boolean;
      heading?: string;
      title: string;
      description?: string;
      btnContent: string;
      btnColor: string;
      btnTextColor: string;
      bgHexColor: string;
      textHexColor1: string;
      textHexColor2: string;
      href: string;
      hasBlurOnMobile: boolean;
      locale: string;
    };
  }[];
}

// CarouselSlide data structure interface from Strapi
export interface ICarouselSlideStrapi {
  id: number;
  title: string;
  heading: string;
  description: string;
  percentage?: number;
  price: number;
  btnContent: string;
  btnColor: string;
  btnTextColor: string;
  href: string;
  image: { data: { attributes: { url: string } } };
  bgHexColor: string;
  textHexColor1: string;
  textHexColor2: string;
  isLeft?: boolean;
  hasBlurOnMobile?: boolean;
  locale: string;
  localizations: { data: { attributes: ICarouselSlideStrapiLocal }[] };
}

export interface IFetchSlidesResponse {
  data: ICarouselSlideStrapi[]; // Array of carousel slides from Strapi
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StarpiImageAttribute {
  data: { attributes: { url: string } };
}

export interface StrapiSlider {
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt: string; // ISO date string
  btnColor: string;
  locale: string;
  image: StrapiImage;
  localizations: {
    data: any[]; // Adjust type based on the localization data structure
  };
}


export interface IStrapiResponse2<T> {
  data: { id: number; attributes: T }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
export interface IStrapiResponseOne<T> {
  data: { id: number; attributes: T };
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
export interface IPageAttribute {
  locale: string;
  slug: string;
  name: string;
  content: string;
  localizations: {
    data: {
      id: number;
      attributes: {
        locale: string;
        slug: string;
        name: string;
        content: string;
      };
    }[];
  };
}
export type TPageStrapiResponse = IStrapiResponse2<IPageAttribute>;
export type TOnePageStrapiResponse = IStrapiResponseOne<IPageAttribute>;

export interface IHeroImgAttribute {
  src: {
    data: {
      id: number;
      attributes: {
        name: string;
        url: string;
      };
    };
  };
}
export interface INavItmAttribute {
  name: string;
  href: string;
  innerProducts: {
    id: number;
    name: string;
    href: string;
  }[];
  innerImgs: {
    id: number;
    href: string;
    image: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
  }[];
}

export interface IStrapiHeroImage {
  id: number;
  attributes: IHeroImgAttribute;
}

export interface IStrapiNavBar {
  id: number;
  attributes: INavItmAttribute;
}
