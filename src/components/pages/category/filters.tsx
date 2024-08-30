'use client'

import useCustomProductAttributes from "@/hooks/product-attributes/useCustomProductAttributes";
import {useMemo} from "react";
import ProductAttributeFilter from "@/components/pages/category/product-attribute-filter";
import {Spinner} from "flowbite-react";
import SearchInput from "@/components/pages/category/search-input";

const Filters = ({productSlug, className}: {productSlug: string; className: string}) => {
  const {data, isLoading} = useCustomProductAttributes({
    categoryName: productSlug,
  })

  const productAttributes = useMemo(() => {
    return data?.data.filter(pa => !pa.slug.includes("pa_yookassa"))
  }, [data?.data])

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
    </form>
  )
}

export default Filters;