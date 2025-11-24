'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import ProductAttributeFilter from "@/components/pages/category/product-attribute-filter";
import useCustomProductAttributes from "@/hooks/product-attributes/useCustomProductAttributes";
import { Spinner } from "flowbite-react";
import SearchInput from "@/components/pages/category/search-input";
import PriceSliderFilter from "@/components/pages/category/price-slider-filter";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";

const Filters = ({
                     productSlug,
                     className,
                     productMaxPrice,
                     currencyRates,
                 }: {
    productSlug?: string;
    className: string;
    productMaxPrice: number;
    currencyRates: CustomCurrencyRates;
}) => {
    const { data, isLoading } = useCustomProductAttributes({
        categoryName: productSlug || "all",
    });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const productAttributes = data?.filter(pa =>
        !pa.slug.includes("pa_yookassa")).sort((a, b) => {
        if (a.slug === "pa_razmer") return -1;
        if (b.slug === "pa_razmer") return 1;
        if (a.slug === "pa_tsvet") return -1;
        if (b.slug === "pa_tsvet") return 1;
        return 0;
    }) || [];

    // === state фильтров ===
    const [filters, setFilters] = useState<Record<string, string[]>>(() => {
        const initial: Record<string, string[]> = {};
        productAttributes.forEach(attr => {
            const slug = attr.slug.replace("pa_", "");
            const param = searchParams.get(slug);
            initial[slug] = param ? param.split("-i-") : [];
        });
        // on-sale
        initial["sale"] = searchParams.get("sale") === "1" ? ["1"] : [];
        return initial;
    });

    // === Ref для debounce таймера ===
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // === Функция для изменения фильтра ===
    const handleFilterChange = (slug: string, value: string) => {
        // Update filters immediately
        setFilters(prev => {
            const prevValues = prev[slug] || [];
            const newValues = prevValues.includes(value)
                ? prevValues.filter(v => v !== value)
                : [...prevValues, value];
            const updatedFilters = { ...prev, [slug]: newValues };

            // Debounce URL update using updatedFilters
            if (debounceRef.current) clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => {
                const currentParamsRaw = qs.parse(searchParams.toString()); // string | string[] | null
                const currentParams: Record<string, string | null> = {};

                // Convert all values to single string or undefined
                Object.entries(currentParamsRaw).forEach(([k, v]) => {
                    if (Array.isArray(v)) {
                        currentParams[k] = v.join(","); // or pick first: v[0]
                    } else if (v === null) {
                        currentParams[k] = null;
                    } else {
                        currentParams[k] = v;
                    }
                });

                        // Now build newParams with updatedFilters
                        const newParams: Record<string, string | null> = { ...currentParams };
                        Object.entries(updatedFilters).forEach(([s, values]) => {
                            newParams[s] = values.length ? values.join("-i-") : null;
                        });

                        // ⛔ УДАЛЯЕМ page при любом обновлении фильтра
                        delete newParams["page"];

                const url = qs.stringifyUrl({ url: pathname, query: newParams }, { skipEmptyString: true, skipNull: true });
                router.replace(url);
            }, 800);

            return updatedFilters; // important: return updated state
        });
    };

    // === On Sale ===
    const isOnSale = filters["sale"]?.includes("1") || false;
    const handleOnSaleChange = () => handleFilterChange("sale", "1");

    return (
        <form className={className} onSubmit={e => e.preventDefault()}>
            {isLoading && (
                <div className="flex w-full justify-center">
                    <Spinner />
                </div>
            )}

            <SearchInput />

            {productAttributes?.map(attr => (
                <ProductAttributeFilter
                    key={attr.slug}
                    customProductAttribute={attr}
                    activeValues={filters[attr.slug.replace("pa_", "")] || []}
                    onChange={(value: string) => handleFilterChange(attr.slug.replace("pa_", ""), value)}
                />
            ))}

            <div className="flex items-center space-x-2 py-3">
                <input
                    type="checkbox"
                    id="sale"
                    checked={isOnSale}
                    onChange={handleOnSaleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="sale" className="text-sm font-medium text-gray-900">
                    Товары со скидкой
                </label>
            </div>

            <PriceSliderFilter productMaxPrice={productMaxPrice} currencyRates={currencyRates} />
        </form>
    );
};

export default Filters;
