'use client';

import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";

const ProductAttributeTermCheckbox = ({
  pat,
  isActive,
  onChange,
}: {
  pat: ProductAttributeTerm,
  isActive: boolean,
  onChange: () => void,
}) => {
  return (
    <div className="flex items-center">
      <input
        id={`filter-${pat.id}`}
        name={`${pat.id}[]`}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        checked={isActive}
        onChange={onChange}
      />
      <label
        htmlFor={`filter-${pat.id}`}
        className="ml-3 text-sm text-gray-600 w-full cursor-pointer"
      >
        {pat.name}
      </label>
    </div>
  )
}

export default ProductAttributeTermCheckbox;