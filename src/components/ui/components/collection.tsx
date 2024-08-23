'use client'

import Link from "next/link";
import qs from "query-string";
import useProductCategories from "@/hooks/product-categories/useProductCategories";
import {ProductCategory} from "@/types/woo-commerce/product-category";

const Collection = ({
  category,
  subcategory
}: {
  category: ProductCategory,
  subcategory: ProductCategory
}) => {
  const {data} = useProductCategories({ parent: subcategory.id })

  return (
    <div className="flex flex-col gap-2">
      {data?.data.map(i => {
        const href = qs.stringifyUrl({
          url: '/shop',
          query: {
            category: category.slug,
            subcategory: subcategory.slug,
            collection: i.slug,
          }
        })

        return (
          <Link
            key={i.id}
            href={href}
            className="flex items-center pl-3 w-fit transition duration-300 hover:text-black"
          >
            <span className="text-xs mr-2">
              ▸
            </span>
            {" "}
            {`${i.name}`}
          </Link>
        )
      })}
    </div>
  )
}

export default Collection;