'use client'

import { useState, useMemo, useRef, useEffect, useActionState, useTransition } from 'react'

import { getPostcodes } from '@/app/actions/cdek'
import Combobox from './components/combobox'

export interface PostCodeComboboxProps {
  city_code: string,
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  className?: string
}

interface CityItem {
  code: string
  name: string
}

export default function PostCodeCombobox({
  city_code,
  value,
  onChange,
  className,
}: PostCodeComboboxProps) {


  const [allPostCodes, setAllPostCodes] = useState<any[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const fetchPostcodes = async () => {
      if (!city_code) return;

      // 2. Оборачиваем вызов в startTransition
      startTransition(async () => {
        try {
          const res = await getPostcodes({
            code: parseInt(city_code)
          });

          if (!isMounted || !res) return;

          const postcodes = res
            .map((item: { toString: () => any }) => ({
              code: item.toString(),
              name: item,
            }))
          setAllPostCodes(postcodes);
        } catch (error) {
          console.error("Ошибка при загрузке городов:", error);
        }
      });
    };

    fetchPostcodes();

    return () => { isMounted = false; }; // Очистка, чтобы не обновлять стейт размонтированного компонента
  }, [city_code]); // Перезапустится при изменении country


  return (
    <div className={className}>

      <Combobox
        items={allPostCodes}
        value={value}
        onChange={onChange}
        label="Почтовый индекс"
        placeholder='Выберите почтовый индекс'
        search_placeholder='Поиск почтового индекса...'

      />
      {isPending && <div className="text-sm">Загрузка списка индексов...</div>}
    </div>
  )
}

