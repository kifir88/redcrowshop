'use client';

import { cn } from "@/libs/utils";
import ProductAttributeTermCheckbox from "@/components/pages/category/product-attribute-term-checkbox";
import { CustomProductAttribute } from "@/types/woo-commerce/custom-product-attribute";

interface ProductAttributeFilterProps {
    customProductAttribute: CustomProductAttribute;
    activeValues: string[]; // выбранные значения из родителя
    onChange: (value: string) => void; // вызываем при клике
}

const ProductAttributeFilter = ({
                                    customProductAttribute,
                                    activeValues,
                                    onChange
                                }: ProductAttributeFilterProps) => {
    // 🧩 Custom sort для размера
    const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "1", "2"];
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
                {sortedOptions.map(option => (
                    <ProductAttributeTermCheckbox
                        key={option.slug}
                        productAttributeOption={option}
                        isActive={activeValues.includes(option.slug)}
                        onChange={() => onChange(option.slug)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductAttributeFilter;
