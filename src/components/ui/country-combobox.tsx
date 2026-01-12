'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import CountryList from 'country-list'
import Combobox from './components/combobox'
import countries from '@ntpu/i18n-iso-countries';

export interface CountryComboboxProps {
  value: string
  onChange: (value: { code: string; name: string } | null) => void
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
  className,
}: CountryComboboxProps) {

  const [allCountries, setAllCountries] = useState<CountryItem[]>([]);


  useEffect(() => {
    const fetchCountries = async () => {
      const locale = await import(`@ntpu/i18n-iso-countries/langs/ru.json`)
      countries.registerLocale(locale)
      const all_countries = countries.getNames('ru')
      const formattedCountries = Object.entries(all_countries).map(([code, name]) => ({
        code, name
      }));
      setAllCountries(formattedCountries)
    }

    fetchCountries()
  }, []); // Пустой массив [] гарантирует выполнение один раз




  return (
    <div className={className}>
      <Combobox
        items={allCountries}
        value={value}
        onChange={onChange}
        label="Страна"
        placeholder='Выберите страну'
        search_placeholder='Поиск страны...'
        returnFullObject={true}
      />
    </div>
  )
}

