'use client'

import useCustomProductAttributes from "@/hooks/product-attributes/useCustomProductAttributes";
import {useMemo} from "react";
import ProductAttributeFilter from "@/components/pages/category/product-attribute-filter";
import {Spinner} from "flowbite-react";

const Filters = ({productSlug}: {productSlug: string}) => {
  const {data, isLoading} = useCustomProductAttributes({
    categoryName: productSlug,
  })

  const productAttributes = useMemo(() => {
    return data?.data.filter(pa => !pa.slug.includes("pa_yookassa"))
  }, [data?.data])

  return (
    <form className="hidden lg:block">
      {isLoading && (
        <div className="flex w-full justify-center">
          <Spinner />
        </div>
      )}

      {productAttributes?.map(cpa => (
        <ProductAttributeFilter key={cpa.slug} customProductAttribute={cpa} />
      ))}
    </form>
  )
}

export default Filters;