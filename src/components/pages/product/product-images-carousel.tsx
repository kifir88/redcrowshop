"use client";

import {Image} from "@/types/woo-commerce/product";

export default function ProductImagesCarousel({
  productImage,
}: {
  productImage: Image;
}) {

  return (
    <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <img
          key={productImage.src}
          alt={productImage.alt}
          src={productImage.src}
          className="lg:col-span-2"
        />
      </div>
    </div>
  )
}