'use client'

import { useState, useMemo, useRef, useEffect, useActionState, useTransition } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { cn } from '@/libs/utils'
import { getCities } from '@/app/actions/cdek'
import Combobox from './components/combobox'

export interface CityComboboxProps {
  country: string,
  region: string,
  value: string
  onChange: (value: { code: string; name: string } | null) => void
  label?: string
  placeholder?: string
  className?: string
}

interface CityItem {
  code: string
  name: string
}

export default function CityCombobox({
  country,
  region,
  value,
  onChange,
  className,
}: CityComboboxProps) {


  const [allCities, setAllCities] = useState<any[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const fetchCities = async () => {
      if (!region) return;

      // 2. Оборачиваем вызов в startTransition
      startTransition(async () => {
        try {
          const res = await getCities({
            country_codes: [country],
            region_code: parseInt(region),
          });

          if (!isMounted || !res) return;

          // Обработка данных
          const cities = res
            .map((item: { code: { toString: () => any }; city: any }) => ({
              code: item.code.toString(),
              name: item.city,
            }))
            .filter((item: { name: string }) => !item.name.includes('удален'));

          setAllCities(cities);
        } catch (error) {
          console.error("Ошибка при загрузке городов:", error);
        }
      });
    };

    fetchCities();

    return () => { isMounted = false; }; // Очистка, чтобы не обновлять стейт размонтированного компонента
  }, [country, region]); // Перезапустится при изменении country


  return (
    <div className={className}>
      
      <Combobox
        items={allCities}
        value={value}
        onChange={onChange}
        label="Город/населённый пункт"
        placeholder='Выберите город/населённый пункт'
        search_placeholder='Поиск города/населённого пункта...'
        returnFullObject={true}
      />
      {isPending && <div className="text-sm">Загрузка списка городов...</div>}
    </div>
  )
}

