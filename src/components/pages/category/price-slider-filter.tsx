"use client"

import MultiRangeSlider from "@/components/fields/multi-range-slider";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {useDebounceValue} from "usehooks-ts";
import qs from "query-string";

export default function PriceSliderFilter({productMaxPrice}: {productMaxPrice: number}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState({
    minPrice: 0,
    maxPrice: productMaxPrice,
  });
  const [debouncedValue] = useDebounceValue(value, 400)

  const handleUpdatePriceParams = () => {
    const currentParams = qs.parse(searchParams.toString());

    const newParams = {
      ...currentParams,
      min_price: debouncedValue.minPrice,
      max_price: debouncedValue.maxPrice,
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query: newParams,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  useEffect(() => {
    handleUpdatePriceParams()
  }, [debouncedValue])


  return (
    <div className="relative flex flex-col border-b border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <div
          className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
        >
          <span
            className="font-medium text-gray-900"
          >
            Цена
          </span>
        </div>
      </h3>
      <div className="pt-6 space-y-4">
        <MultiRangeSlider
          min={0}
          max={productMaxPrice}
          onChange={({ min, max }: { min: number; max: number }) =>
            setValue({
              minPrice: min,
              maxPrice: max,
            })
          }
        />
      </div>
    </div>
  );
}