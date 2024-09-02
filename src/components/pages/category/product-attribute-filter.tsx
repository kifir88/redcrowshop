'use client';

import {cn} from "@/libs/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";
import ProductAttributeTermCheckbox from "@/components/pages/category/product-attribute-term-checkbox";
import {CustomProductAttribute} from "@/types/woo-commerce/custom-product-attribute";

const ProductAttributeFilter = ({customProductAttribute}: {customProductAttribute: CustomProductAttribute}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const formattedSlug = customProductAttribute.slug.replace("pa_", "")

  const productAttributeParam = searchParams.get(formattedSlug);
  const productAttributeTerms = productAttributeParam?.split("-i-")

  const handleSelectOption = (productAttributeTermSlug: string) => {
    const currentParams = qs.parse(searchParams.toString());

    const previousAttributeValues = productAttributeParam
      ? productAttributeParam.split("-i-")
      : [];

    const newAttributeValues = previousAttributeValues.includes(productAttributeTermSlug)
      ? previousAttributeValues.filter(v => v !== productAttributeTermSlug)
      : [...previousAttributeValues, productAttributeTermSlug]

    const newParams = {
      ...currentParams,
      [formattedSlug]: newAttributeValues.join("-i-"),
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query: newParams,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  return (
    <div className="flex flex-col border-b border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <div
          className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
        >
          <span
            className={cn(
              "font-medium text-gray-900",
            )}
          >
            {customProductAttribute.name}
          </span>
        </div>
      </h3>
      <div className="pt-6 space-y-4">
        {customProductAttribute.options.map((productAttributeOption) => (
            <ProductAttributeTermCheckbox
              key={productAttributeOption.slug}
              productAttributeOption={productAttributeOption}
              isActive={!!productAttributeTerms?.includes(productAttributeOption.slug)}
              onChange={() => handleSelectOption(productAttributeOption.slug)}
            />
          )
        )}
      </div>
    </div>
  )
}

export default ProductAttributeFilter;