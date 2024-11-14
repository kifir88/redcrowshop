"use client"

import {Carousel} from "flowbite-react";
import CarouselItem from "@/components/pages/home/carousel-item";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {StrapiSliderApiResponse} from "@/types/strapi/strapi-slider";

export default function HeroCarousel({strapiSlider}: {strapiSlider: StrapiSliderApiResponse}) {
  return (
    <main className="">
      <Carousel
          slideInterval={10000} // Set the interval to 5000ms (5 seconds), adjust as needed
        //leftControl={(
        //>/  <div>
        //    <ChevronLeft className="size-10" strokeWidth={1.2} />
        //  </div>
        //)}
        //rightControl={(
        //  <div>
        //    <ChevronRight className="size-10" strokeWidth={1.2} />
        //  </div>
        //)}
      >
        {strapiSlider.data.map(ai => (
          <CarouselItem key={ai.id} item={ai.attributes} locale="ru" />
        ))}
      </Carousel>
    </main>
  )
}