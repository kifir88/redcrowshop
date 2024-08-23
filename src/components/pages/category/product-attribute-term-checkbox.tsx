'use client';

import {CustomProductAttribute} from "@/types/woo-commerce/custom-product-attribute";

const ProductAttributeTermCheckbox = ({
  productAttributeOption,
  isActive,
  onChange,
}: {
  productAttributeOption: CustomProductAttribute['options'][0],
  isActive: boolean,
  onChange: () => void,
}) => {
  return (
    <div className="flex items-center">
      <input
        id={`filter-${productAttributeOption.term_id}`}
        name={`${productAttributeOption.term_id}[]`}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        checked={isActive}
        onChange={onChange}
      />
      <label
        htmlFor={`filter-${productAttributeOption.term_id}`}
        className="ml-3 text-sm text-gray-600 w-full cursor-pointer"
      >
        {productAttributeOption.name}
      </label>
    </div>
  )
}

export default ProductAttributeTermCheckbox;