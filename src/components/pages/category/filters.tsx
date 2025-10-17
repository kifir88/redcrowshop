'use client'

import useCustomProductAttributes from "@/hooks/product-attributes/useCustomProductAttributes";
import {useMemo} from "react";
import ProductAttributeFilter from "@/components/pages/category/product-attribute-filter";
import {Spinner} from "flowbite-react";
import SearchInput from "@/components/pages/category/search-input";
import PriceSliderFilter from "@/components/pages/category/price-slider-filter";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";

const Filters = ({
                   productSlug,
                   className,
                   productMaxPrice,
                   currencyRates,
                 }: {
  productSlug?: string;
  className: string;
  productMaxPrice: number;
  currencyRates: CustomCurrencyRates;
}) => {
  const {data, isLoading} = useCustomProductAttributes({
    categoryName: productSlug || "all",
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

    const productAttributes = useMemo(() => {
        if (!data) return [];

        return data
            .filter(pa => !pa.slug.includes("pa_yookassa"))
            .sort((a, b) => (a.slug === "pa_razmer" ? -1 : b.slug === "pa_razmer" ? 1 : 0));
    }, [data]);


  // Get current on-sale state from URL
  const isOnSale = searchParams.get("sale") === "1";

  const handleOnSaleChange = () => {
      const currentParams = qs.parse(searchParams.toString());
      const newParams = Object.fromEntries(
          Object.entries({
              ...currentParams,
              sale: isOnSale ? undefined : '1',
          }).filter(([key]) => key !== 'page')
      );

     delete newParams["page"];

    const url = qs.stringifyUrl({
      url: pathname,
      query: newParams,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  return (
      <form className={className}>
        {isLoading && (
            <div className="flex w-full justify-center">
              <Spinner />
            </div>
        )}

        <SearchInput />

        {productAttributes?.map(cpa => (
            <ProductAttributeFilter key={cpa.slug} customProductAttribute={cpa} />
        ))}

          {/* On Sale Checkbox */}
          <div className="flex items-center space-x-2 py-3">
              <input
                  type="checkbox"
                  id="sale"
                  checked={isOnSale}
                  onChange={handleOnSaleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="sale" className="text-sm font-medium text-gray-900">
                  Товары со скидкой
              </label>
          </div>


          <PriceSliderFilter productMaxPrice={productMaxPrice} currencyRates={currencyRates} />
      </form>
  );
};

export default Filters;
