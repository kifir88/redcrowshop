"use client"

import {useState} from "react";
import MultiRangeSlider from "@/components/fields/multi-range-slider";

export default function PriceSliderFilter() {

  return (
    <div className="relative flex w-full mt-10">
      <MultiRangeSlider
        min={0}
        max={100000}
        onChange={({ min, max }: { min: number; max: number }) =>
          console.log(`min = ${min}, max = ${max}`)
        }
      />
    </div>
  );
}