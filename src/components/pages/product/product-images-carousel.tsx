"use client";

import {Image as ProductImage} from "@/types/woo-commerce/product";
import Image from "next/image";

export default function ProductImagesCarousel({
  productImage,
}: {
  productImage: ProductImage | null;
}) {

  const imageSrc = productImage?.src || "/category/product-image-placeholder.png";
  const imageAlt = productImage?.alt || "placeholder";

  return (
    <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={imageAlt}
          className="lg:col-span-2"
          height={1509}
          width={696}
        />
      </div>
    </div>
  )
}