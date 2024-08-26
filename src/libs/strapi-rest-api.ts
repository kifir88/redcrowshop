import axios from "axios";

const STRAPI_API_URL = "https://api.redcrow.kz";
const STRAPI_API_KEY = "dc804e7aaf256c5744ae633d5b5bb95e51ffdee9d75836a0eda42a6262c371ad919a68ca7af76486104e78dac7a21b16770d46d21e9ef599d86b809d5d498c99f92a4dcfee086855001f5e6bc4f85e171e480c4748825fd2f2aa9b96f181110bc9281b7408f829504586e6a414f54985d7f470a9bf7a05acf293bbf3fcb8c024";

const strapiInstance = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    Authorization: `Bearer ${STRAPI_API_KEY}`,
  },
});

export const fetchHeroImage = () => {
  return strapiInstance.get("/api/hero-img?populate=*")
};
export const fetchNavItems = () => {
  return strapiInstance.get("/api/navbar-items?populate=deep")
};
export const fetchSlider = () => {
  return strapiInstance.get("/api/slider?populate=*")
};
export const fetchSocialMedia = () => {
  return strapiInstance.get("/api/socials")
}
export const fetchFooterPages = () => {
  return strapiInstance.get("/api/pages?populate=*")
}
export const fetchDynamicPaths = () => {
  return strapiInstance.get("/api/pages?populate=*");
}
export const fetchPageData = (slug: string) => {
  return strapiInstance.get(`/api/pages/${slug}?populate=*`);
}
