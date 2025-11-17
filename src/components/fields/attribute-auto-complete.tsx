"use client"

import { Attribute } from "@/types/woo-commerce/product";
import useProductAttributeTerms from "@/hooks/product-attribute-terms/useProductAttributeTerms";
import { useEffect, useMemo, useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Spinner } from "flowbite-react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { ProductAttributeTerm } from "@/types/woo-commerce/product-attribute-term";
import { cn } from "@/libs/utils";
import { ProductVariation } from "@/types/woo-commerce/product-variation";
import {UseFormReturnType} from "@mantine/form";

type FormValues = Record<number, ProductAttributeTerm | null>

export interface AttributeAutoCompleteProps {
  value: ProductAttributeTerm | null;
  onChange: (value: ProductAttributeTerm | null) => void;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  attribute: Attribute;
  productVariations: ProductVariation[];
  form: UseFormReturnType<FormValues>;
}

interface ItemAutoComplete {
  label: string;
  value: ProductAttributeTerm;
  disabled: boolean;
}

export default function AttributeAutoComplete({
  attribute,
  label,
  placeholder,
  value,
  onChange,
  productVariations,
  form,
}: AttributeAutoCompleteProps) {
  const { data, isLoading, isSuccess } = useProductAttributeTerms(attribute.id);

  const [items, setItems] = useState<ItemAutoComplete[]>([]);


  useEffect(() => {
    if (isSuccess && data) {
      const availableOptions = new Set<string>();

      // Логика фильтрации вариаций на основе выбранных значений в форме
      const filteredVariations = productVariations.filter(variation => {
        return Object.entries(form.values).every(([attrId, selectedAttr]) => {
          const match = variation.attributes.find(attr => attr.id === Number(attrId));
          // Перерасчет: если значение атрибута сброшено на null, этот атрибут не проверяется
          return match ? (selectedAttr ? match.option === selectedAttr.name : true) : true;
        });
      });

      // Собираем доступные опции для данного атрибута из отфильтрованных вариаций
      filteredVariations.forEach(variation => {
        variation.attributes.forEach(attr => {
          if (attr.id === attribute.id && variation.image !== null) {
            availableOptions.add(attr.option);
          }
        });
      });

      // Previous solution with disabled options which are out of stock
      /*setItems(
          Array.from(new Map(data?.data
              ?.filter(i => availableOptions.has(i.name))
              .map(i => [i.name, {
                label: i.name,
                value: i,
                disabled: !availableOptions.has(i.name) ||
                    !filteredVariations.some(variation =>
                        variation.attributes?.some(attr => attr.option === i.name) &&
                        (variation?.stock_quantity || 0) > 0
                    ),
              }])).values()) // Ensures only unique names are kept
      );*/

      // new solution with hidden options which are out of stock
        const notSortedItems=  Array.from(
            new Map<string, ItemAutoComplete>(
                data
                    ?.filter(i => availableOptions.has(i.name))
                    .map(k => {
                        const isAvailable = filteredVariations.some(variation =>
                            variation.attributes?.some(attr => {
                                    return attr.option === k.name;
                                }
                            ) &&
                            (variation?.stock_quantity || 0) > 0 && variation?.stock_status == "instock"
                        );

                        return isAvailable ? [k.name, { label: k.name, value: k }] : null;
                    })
                    .filter((item): item is [string, ItemAutoComplete] => Boolean(item)) // Type guard to remove null values
            ).values());

        // 🧩 Custom order for size (razmer)
        const sizeOrder =     ["XS", "S", "M" ,"L", "XL", "2XL", "3XL", "4XL", "1", "2"]
        let sortedOptions = notSortedItems;

        if (attribute.name === "Размер") {
            sortedOptions.sort((a, b) => {
                const indexA = sizeOrder.indexOf(a.value.name);
                const indexB = sizeOrder.indexOf(b.value.name);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
        }

      setItems(sortedOptions);

    }
  }, [isSuccess, data, productVariations, form.values, attribute.id, value]); // Добавляем зависимость от value


  const valueLabel = useMemo(() => {
    return value?.name || placeholder || "Выберите опцию";
  }, [value?.name, placeholder]);

  const clearSelection = () => {
    onChange(null); // Передаем null, чтобы сбросить значение
  };

  return (
    <Listbox value={value || null} onChange={onChange} disabled={isLoading}>
      {label && (
        <Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Label>
      )}

      <div className="relative mt-2">
        <ListboxButton
          className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onClick={() => clearSelection()}
        >
          <span className="block truncate">{valueLabel}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {!value && (
              <>
                {isLoading
                  ? <Spinner color="gray" size="sm" />
                  : <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />}
              </>
            )}


            {!!value && (
              <XMarkIcon color="gray" className="h-5 w-5 text-gray-400" onClick={clearSelection} />
            )}
          </span>
        </ListboxButton>

        <ListboxOptions
          hidden={!!value}
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {items.map((i) => (
            <ListboxOption
              key={i.value.id}
              value={i.value}
              disabled={i.disabled} // дизейблим недоступные опции
              className={cn(
                "group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900",
                "data-[focus]:bg-indigo-600 data-[focus]:text-white",
                i.disabled && "opacity-25"
              )}
            >
              <span className="block truncate font-normal group-data-[selected]:font-semibold">
                {i.label}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                <CheckIcon aria-hidden="true" className="h-5 w-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
