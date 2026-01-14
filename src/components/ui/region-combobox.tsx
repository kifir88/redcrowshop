'use client'

import { useState, useMemo, useRef, useEffect, useTransition } from 'react'
import { getRegions } from '@/app/actions/cdek'
import Combobox from './components/combobox'

export interface RegionComboboxProps {
  country: string,
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

export default function RegionCombobox({
  country,
  value,
  onChange,
  className,
}: RegionComboboxProps) {


  const [allRegions, setAllRegions] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const fetchRegions = async () => {
      if (!country) return;

      startTransition(async () => {
        try {
          const res = await getRegions({
            country_codes: country
          });

          if (!isMounted || !res) return;

          const regions = res.map((item: { region: string; region_code: any }) => {
            return {
              'code': item.region_code.toString(),
              'name': item.region,
            }
          }).filter((item: { name: string }) => !item.name.includes('удален'))
          setAllRegions(regions || []);
        } catch (error) {
          console.error("Ошибка при загрузке:", error);
        }
      });
    };

    fetchRegions();

    return () => { isMounted = false; }; // Очистка, чтобы не обновлять стейт размонтированного компонента
  }, [country]); // Перезапустится при изменении country


  return (
    <div className={className}>
      <Combobox
        items={allRegions}
        value={value}
        onChange={onChange}
        label="Область/регион"
        placeholder='Выберите область/регион'
        search_placeholder='Поиск области/региона...'
        returnFullObject={true}
        disabled={isPending}
      />
      {isPending && <div className="text-sm text-blue-600">Загрузка списка регионов...</div>}
    </div>
  )
}

