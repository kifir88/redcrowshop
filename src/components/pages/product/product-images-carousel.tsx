"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Image as ProductImage, Product } from "@/types/woo-commerce/product";
import Image from "next/image";

// Right arrow
function NextArrow({ onClick, disabled }: { onClick?: () => void; disabled: boolean }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        position: "absolute",
        top: "50%",
        right: "20px",
        transform: "translateY(-50%)",
        zIndex: 10,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      className="bg-white shadow px-3 py-2 text-sm hover:bg-gray-200"
      aria-label="Next Slide"
    >
      ►
    </button>
  );
}

// Left arrow
function PrevArrow({ onClick, disabled }: { onClick?: () => void; disabled: boolean }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        position: "absolute",
        top: "50%",
        left: "20px",
        transform: "translateY(-50%)",
        zIndex: 10,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      className="bg-white shadow px-3 py-2 text-sm hover:bg-gray-200"
      aria-label="Previous Slide"
    >
      ◄
    </button>
  );
}

interface Props {
  images: Product["images"];
  productImageIndex: number | null;
}

export default function ProductImagesCarousel({ images, productImageIndex }: Props) {
  const [activeSlider, setActiveSlider] = useState(0);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    if (productImageIndex !== null) {
      sliderRef.current?.slickGoTo(productImageIndex);
    }
  }, [productImageIndex]);

  const settings = {
    initialSlide: activeSlider,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    accessibility: false,
    nextArrow: <NextArrow disabled={activeSlider === images.length - 1} />, // Disable next on last slide
    prevArrow: <PrevArrow disabled={activeSlider === 0} />, // Disable prev on first slide
    afterChange: (current: number) => setActiveSlider(current),
  };

  return (
    <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
      <div className="grid grid-cols-1 lg:gap-8">
        <div className="aspect-3/4 lg:col-span-2 max-h-[1509px]">
          <Slider ref={sliderRef} {...settings}>
            {images.map((img, index) => (
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Image
                  key={img?.id || index}
                  src={img?.src}
                  alt={img?.alt || "placeholder"}
                  width={696}
                  height={1002}
                  className="object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

