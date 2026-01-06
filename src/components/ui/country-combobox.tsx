'use client'

import { useState, useMemo, useRef } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import CountryList from 'country-list'
import { cn } from '@/libs/utils'

export interface CountryComboboxProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
}

interface CountryItem {
  code: string
  name: string
}

export default function CountryCombobox({
  value,
  onChange,
  label = 'Страна',
  placeholder = 'Выберите страну',
  className,
}: CountryComboboxProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const allCountries: CountryItem[] = useMemo(() => {
    return CountryList.getData().map((country) => ({
      code: country.code,
      name: country.name,
    }))
  }, [])

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCountries
    }
    const query = searchQuery.toLowerCase().trim()
    return allCountries.filter((country) =>
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query)
    )
  }, [allCountries, searchQuery])

  const selectedCountry = useMemo(() => {
    return allCountries.find((c) => c.code === value)
  }, [allCountries, value])

  const handleButtonClick = () => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <ListboxButton
            className={cn(
              'relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm',
              'text-gray-900'
            )}
            onClick={handleButtonClick}
          >
            <span className={cn('block truncate', !value && 'text-gray-400')}>
              {selectedCountry?.name || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
          >
            {/* Поиск */}
            <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-10">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Поиск страны..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                    }
                  }}
                />
              </div>
            </div>

            {/* Список стран */}
            <div className="overflow-y-auto max-h-48">
              {filteredCountries.length === 0 ? (
                <div className="py-4 px-3 text-sm text-gray-500 text-center">
                  Ничего не найдено
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <ListboxOption
                    key={country.code}
                    value={country.code}
                    className={cn(
                      'group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900',
                      'data-[focus]:bg-indigo-600 data-[focus]:text-white',
                      'data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700'
                    )}
                  >
                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                      {country.name}
                    </span>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                      <CheckIcon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </ListboxOption>
                ))
              )}
            </div>
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}

