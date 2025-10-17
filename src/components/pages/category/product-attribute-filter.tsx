'use client';

import { cn } from "@/libs/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import ProductAttributeTermCheckbox from "@/components/pages/category/product-attribute-term-checkbox";
import { CustomProductAttribute } from "@/types/woo-commerce/custom-product-attribute";

const ProductAttributeFilter = ({ customProductAttribute }: { customProductAttribute: CustomProductAttribute }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const formattedSlug = customProductAttribute.slug.replace("pa_", "");

    const productAttributeParam = searchParams.get(formattedSlug);
    const productAttributeTerms = productAttributeParam?.split("-i-");

    const handleSelectOption = (productAttributeTermSlug: string) => {
        const currentParams = Object.fromEntries(
            Object.entries(qs.parse(searchParams.toString())).filter(([k]) => k !== 'page')
        );
        const previousAttributeValues = productAttributeParam
            ? productAttributeParam.split("-i-")
            : [];

        const newAttributeValues = previousAttributeValues.includes(productAttributeTermSlug)
            ? previousAttributeValues.filter((v) => v !== productAttributeTermSlug)
            : [...previousAttributeValues, productAttributeTermSlug];

        const newParams = {
            ...currentParams,
            [formattedSlug]: newAttributeValues.join("-i-"),
        };

        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: newParams,
            },
            { skipEmptyString: true, skipNull: true }
        );

        router.push(url);
    };

    // 🧩 Custom order for size (razmer)
    const sizeOrder =     ["XS", "S", "M" ,"L", "XL", "2XL", "3XL", "4XL", "1", "2"]
    let sortedOptions = [...customProductAttribute.options];

    if (customProductAttribute.slug === "pa_razmer") {
        sortedOptions.sort((a, b) => {
            const indexA = sizeOrder.indexOf(a.name.toUpperCase());
            const indexB = sizeOrder.indexOf(b.name.toUpperCase());
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }

    return (
        <div className="flex flex-col border-b border-gray-200 py-6">
            <h3 className="-my-3 flow-root">
                <div className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className={cn("font-medium text-gray-900")}>
            {customProductAttribute.name}
          </span>
                </div>
            </h3>
            <div className="pt-6 space-y-4">
                {sortedOptions.map((productAttributeOption) => (
                    <ProductAttributeTermCheckbox
                        key={productAttributeOption.slug}
                        productAttributeOption={productAttributeOption}
                        isActive={!!productAttributeTerms?.includes(productAttributeOption.slug)}
                        onChange={() => handleSelectOption(productAttributeOption.slug)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductAttributeFilter;
