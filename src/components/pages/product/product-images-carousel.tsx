"use client";

import {useState } from "react";
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
  const imageSrc = productImage?.src || "/category/product-image-placeholder.png";
  const imageAlt = productImage?.alt || "placeholder";

  const imagesArray = images;

  return (
    <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
      <div className="grid grid-cols-1 lg:gap-8">
        {!!productImage ? (
          <Image
            className="aspect-3/4 lg:col-span-2"
            key={imageSrc}
            src={imageSrc}
            alt={imageAlt}
            height={1509}
            width={696}
          />
        ) : (
          <Carousel
            className="aspect-3/4 lg:col-span-2"
            slide={false}
          >
            {imagesArray.map((i) => (
              <Image
                key={i.src}
                src={i.src}
                alt={i.alt}
                height={1509}
                width={696}
              />
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}
