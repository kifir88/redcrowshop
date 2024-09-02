import {fetchCurrencyRates, fetchProducts} from "@/libs/woocommerce-rest-api";
import {fetchHeroImage, fetchSlider} from "@/libs/strapi-rest-api";
import PopularProducts from "@/components/pages/home/popular-products";
import HeroCarousel from "@/components/pages/home/hero-carousel";

export default async function Home() {
  const currencyRatesData = await fetchCurrencyRates();
  const popularProductsData = await fetchProducts({
    orderby: "popularity",
    order: "desc",
    per_page: 6,
  });
  const starpiHeroImageData = await fetchHeroImage();
  const starpiSliderData = await fetchSlider();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <HeroCarousel strapiSlider={starpiSliderData.data} />

      <PopularProducts products={popularProductsData.data} currencyRates={currencyRatesData.data} />
    </main>
  );
}
