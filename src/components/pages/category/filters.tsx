'use client'

import useProductAttributes from "@/hooks/product-attributes/useProductAttributes";
import {useMemo} from "react";
import ProductAttributeFilter from "@/components/pages/category/product-attribute-filter";
import {Spinner} from "flowbite-react";

const Filters = () => {
  const {data, isLoading} = useProductAttributes()

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

      {productAttributes?.map(pa => (
        <ProductAttributeFilter key={pa.slug} productAttribute={pa} />
      ))}
    </form>
  )
}

export default Filters;