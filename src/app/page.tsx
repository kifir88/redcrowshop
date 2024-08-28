import {fetchProducts} from "@/libs/woocommerce-rest-api";
import {fetchHeroImage, fetchSlider} from "@/libs/strapi-rest-api";
import PopularProducts from "@/components/pages/home/popular-products";

export default async function Home() {
  const popularProductsData = await fetchProducts({
    orderby: "popularity",
    order: "desc",
    per_page: 6,
  });
  const starpiHeroImageData = await fetchHeroImage();
  const starpiSliderData = await fetchSlider();

  console.log(starpiHeroImageData.data, "starpiHeroImage")
  console.log(starpiSliderData.data, "starpiSlider.data")

  // const formattedSliderData = starpiSliderData.data.data.map(slider => {
  //   const attributes = slider;
  //   return {
  //     imageUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL + attributes.image.data.attributes.url,
  //     heading: attributes.heading,
  //     title: attributes.title,
  //     description: attributes.description,
  //     btnContent: attributes.btnContent,
  //     btnColor: attributes.btnColor,
  //     btnTextColor: attributes.btnTextColor,
  //     bgHexColor: attributes.bgHexColor,
  //     textHexColor1: attributes.textHexColor1,
  //     textHexColor2: attributes.textHexColor2,
  //     href: attributes.href || "/shop",
  //     isLeft: attributes.isLeft,
  //     locale: attributes.locale,
  //   };
  // });

  // console.log(formattedSliderData, "sliderAttributes")
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">


      <PopularProducts products={popularProductsData.data} />
    </main>
  );
}
