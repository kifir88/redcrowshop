'use client';

import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {MinusIcon, PlusIcon} from "@heroicons/react/20/solid";
import useProductAttributeTerms from "@/hooks/product-attribute-terms/useProductAttributeTerms";
import {ProductAttribute} from "@/types/woo-commerce/product-attrubute";
import {Spinner} from "flowbite-react";
import {cn} from "@/libs/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";

const ProductAttributeFilter = ({productAttribute}: {productAttribute: ProductAttribute}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data,
    isLoading,
    isError
  } = useProductAttributeTerms(productAttribute.id)

  const productAttributeParam = searchParams.get(productAttribute.slug);

  const handleSelectOption = (productAttributeTermSlug: string) => {
    const currentParams = qs.parse(searchParams.toString());

    const previousAttributeValues = productAttributeParam
      ? productAttributeParam.split(",")
      : [];
    const newAttributeValues = previousAttributeValues.includes(productAttributeTermSlug)
      ? previousAttributeValues.filter(v => v !== productAttributeTermSlug)
      : [...previousAttributeValues, productAttributeTermSlug]

    const newParams = {
      ...currentParams,
      [productAttribute.slug]: newAttributeValues.join(","),
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query: newParams,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  return (
    <Disclosure key={productAttribute.slug} as="div" className="border-b border-gray-200 py-6">
      <h3 className="-my-3 flow-root">
        <DisclosureButton
          className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
          disabled={isLoading || isError}
        >
          <span
            className={cn(
              "font-medium text-gray-900",
              isLoading && "text-gray-400"
            )}
          >
            {productAttribute.name}
          </span>
          <span className="ml-6 flex items-center">
            {isLoading
              ? (<Spinner color="info" aria-label="Info spinner example" />)
              : (
                <>
                  <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                  <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                </>
              )}
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel className="pt-6">
        <div className="space-y-4">
          {data?.data.map((pat, optionIdx) => {
            const isActive = !!productAttributeParam?.includes(pat.slug);

            return (
              <div key={pat.slug} className="flex items-center">
                <input
                  id={`filter-${pat.id}-${optionIdx}`}
                  name={`${pat.id}[]`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={isActive}
                  onChange={() => handleSelectOption(pat.slug)}
                />
                <label htmlFor={`filter-${pat.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600 w-full">
                  {pat.name}
                </label>
              </div>
            )
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export default ProductAttributeFilter;