"use client"

import MultiRangeSlider from "@/components/fields/multi-range-slider";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {memo, useState} from "react";
import {useDebounceValue, useIsMounted} from "usehooks-ts";
import qs from "query-string";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {useDidUpdate} from "@mantine/hooks";

function PriceSliderFilter({
  productMaxPrice,
  currencyRates,
}: {
  productMaxPrice: number;
  currencyRates: CustomCurrencyRates;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMounted = useIsMounted()

  const initialValue = {
    minPrice: 0,
    maxPrice: productMaxPrice,
  }
  const [value, setValue] = useState(initialValue);
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

  useDidUpdate(() => {
    handleUpdatePriceParams()
  }, [debouncedValue.maxPrice, debouncedValue.minPrice])


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
          min={initialValue.minPrice}
          max={initialValue.maxPrice}
          currencyRates={currencyRates}
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

export default memo(PriceSliderFilter);