"use client"

import {TextInput} from "flowbite-react";
import {Search} from "lucide-react";
import {useEffect, useState} from "react";
import {useDebounceValue} from "usehooks-ts";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 400)

  const handleUpdateSearchParam = () => {
    const currentParams = qs.parse(searchParams.toString());

    const newParams = {
      ...currentParams,
      search: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query: newParams,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  useEffect(() => {
    handleUpdateSearchParam()
  }, [debouncedValue])

  return (
    <TextInput
      className="mt-2 mb-4"
      sizing="sm"
      icon={Search}
      placeholder="Поиск"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}