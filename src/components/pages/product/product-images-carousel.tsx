"use client";

import { useMemo, useState} from "react";
import { Image as ProductImage, Product } from "@/types/woo-commerce/product";
import Image from "next/image";
import { Carousel } from "flowbite-react";

export default function ProductImagesCarousel({
  images,
  productImage,
}: {
  images: Product["images"];
  productImage: ProductImage | null;
}) {

  const [activeSlider, setActiveSlider] = useState(0)

  const imagesArray = useMemo(() => {
    const updatedImages = [...images];
    if (!!productImage) {
      updatedImages.splice(activeSlider, 0, productImage);
    }
    return updatedImages;
  }, [productImage]);

  return (
    <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
      <div className="grid grid-cols-1 lg:gap-8">
        <Carousel
          className="aspect-3/4 lg:col-span-2"
          slide={false}
          defaultValue={activeSlider}
          onSlideChange={setActiveSlider}
        >
          {imagesArray.map((i) => (
            <Image
              key={i?.src || "/category/product-image-placeholder.png"}
              src={i?.src || "/category/product-image-placeholder.png"}
              alt={i?.alt || "placeholder"}
              height={1509}
              width={696}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
}
