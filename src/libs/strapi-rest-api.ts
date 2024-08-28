import axios, {AxiosResponse} from "axios";
import {StrapiSliderApiResponse} from "@/types/strapi/strapi-slider";
import {StrapiFooterPagesApiResponse} from "@/types/strapi/strapi-footer-pages";
import {StrapiPageApiResponse} from "@/types/strapi/strapi-page";

const strapiInstance = axios.create({
  baseURL: process.env.STRAPI_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
  },
});

export const fetchHeroImage = () => {
  return strapiInstance.get("/api/hero-img?populate=*")
};
export const fetchNavItems = () => {
  return strapiInstance.get("/api/navbar-items?populate=deep")
};
export const fetchSlider = (): Promise<AxiosResponse<StrapiSliderApiResponse>> => {
  return strapiInstance.get("/api/sliders?populate=*")
};
export const fetchSocialMedia = () => {
  return strapiInstance.get("/api/socials")
}
export const fetchFooterPages = (): Promise<AxiosResponse<StrapiFooterPagesApiResponse>> => {
  return strapiInstance.get("/api/pages?populate=*")
}
export const fetchDynamicPaths = () => {
  return strapiInstance.get("/api/pages?populate=*");
}
export const fetchPage = (slug: string): Promise<AxiosResponse<StrapiPageApiResponse>> => {
  return strapiInstance.get(`/api/pages/${slug}?populate=*`);
}
