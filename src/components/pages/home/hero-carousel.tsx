"use client"

import {Carousel} from "flowbite-react";
import CarouselItem from "@/components/pages/home/carousel-item";

export default function HeroCarousel({strapiSlider}: {strapiSlider: StrapiSliderApiResponse}) {
  return (
    <main className="">
      <Carousel>
        {strapiSlider.data.map(ai => (
          <CarouselItem key={ai.id} em={ai.attributes} locale="ru" />
        ))}
      </Carousel>
    </main>
  )
}