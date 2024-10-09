"use client"

import {Attribute} from "@/types/woo-commerce/product";
import useProductAttributeTerms from "@/hooks/product-attribute-terms/useProductAttributeTerms";
import {useEffect, useMemo, useState} from "react";
import {Label, Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import {Spinner} from "flowbite-react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";
import {cn} from "@/libs/utils";

export interface AttributeAutoCompleteProps {
  value: ProductAttributeTerm | null;
  onChange: (value: ProductAttributeTerm) => void;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  attribute: Attribute;
}

interface ItemAutoComplete {
  label: string;
  value: ProductAttributeTerm;
}

export default function AttributeAutoComplete({
  attribute,
  label,
  placeholder,
  value,
  onChange,
}: AttributeAutoCompleteProps) {
  const {
    data,
    isLoading,
    isSuccess,
  } = useProductAttributeTerms(attribute.id)

  const [items, setItems] = useState<ItemAutoComplete[]>([])

  useEffect(() => {
    if (isSuccess && data?.data) {
      setItems(data.data.map(i => (
        {
          label: i.name,
          value: i,
        }
      )))
    }
  }, [isSuccess, data?.data])

  const valueLabel = useMemo(() => {
    return value?.name
      || placeholder
      || "Выберите опцию"
  }, [value?.name, placeholder])

  return (
    <Listbox value={value?.id} disabled={isLoading}>
      {label && (
        <Label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </Label>
      )}

      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{valueLabel}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {isLoading
              ? <Spinner color="gray" size="sm" />
              : <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />}
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {items.map((i) => (
            <ListboxOption
              key={i.value.id}
              value={i.value}
              disabled={!i.value.count}
              onClick={() => {
                onChange(i.value)
              }}
              className={cn(
                "group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900",
                "data-[focus]:bg-indigo-600 data-[focus]:text-white",
                !i.value.count && "opacity-25"
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
  )
}