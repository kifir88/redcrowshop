'use client';

import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {MinusIcon, PlusIcon} from "@heroicons/react/20/solid";
import {cn} from "@/libs/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";
import ProductAttributeTermCheckbox from "@/components/pages/category/product-attribute-term-checkbox";
import {CustomProductAttribute} from "@/types/woo-commerce/custom-product-attribute";

const ProductAttributeFilter = ({customProductAttribute}: {customProductAttribute: CustomProductAttribute}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const {
  //   data,
  //   isLoading,
  //   isError
  // } = useProductAttributeTerms(customProductAttribute.id)

  const productAttributeParam = searchParams.get(customProductAttribute.name);
  const productAttributeTerms = productAttributeParam?.split(",")

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
      [customProductAttribute.name]: newAttributeValues.join(","),
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
          // disabled={isLoading || isError}
        >
          <span
            className={cn(
              "font-medium text-gray-900",
              // isLoading && "text-gray-400"
            )}
          >
            {customProductAttribute.name}
          </span>
          {/*<span className="ml-6 flex items-center">*/}
          {/*  /!*{isLoading*!/*/}
          {/*  /!*  ? (<Spinner color="info" aria-label="Info spinner example" />)*!/*/}
          {/*  /!*  : (*!/*/}
          {/*      <>*/}
          {/*        <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />*/}
          {/*        <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />*/}
          {/*      </>*/}
          {/*  /!* )}*!/*/}
          {/*</span>*/}
        </div>
      </h3>
      <div className="pt-6 space-y-4">
        {customProductAttribute.options.map((productAttributeOption) => (
            <ProductAttributeTermCheckbox
              key={productAttributeOption.slug}
              productAttributeOption={productAttributeOption}
              isActive={!!productAttributeTerms?.includes(productAttributeOption.name)}
              onChange={() => handleSelectOption(productAttributeOption.name)}
            />
          )
        )}
      </div>
    </div>
  )
}

export default ProductAttributeFilter;