'use client';

import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {cn} from "@/libs/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";

const sortOptions = [
  {
    name: 'По умолчанию',
    value: {
      order: null,
      orderby: null,
    }
  },
  {
    name: 'По цене: от низкой к высокой',
    value: {
      order: 'asc',
      orderby: 'price'
    },
  },
  {
    name: 'По цене: от высокой к низкой',
    value: {
      order: 'desc',
      orderby: 'price'
    },
  },
  {
    name: 'По названию: По возрастанию',
    value: {
      order: 'asc',
      orderby: 'title'
    },
  },
  {
    name: 'По названию: По убыванию',
    value: {
      order: 'desc',
      orderby: 'title'
    },
  },
]

const CategoryListSortMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const orderParam = searchParams.get("order");
  const orderbyParam = searchParams.get("orderby");

  const handleSelectOption = (params: Record<string, string | null>) => {
    const currentParams = qs.parse(searchParams.toString());

    const newParams = {
      ...currentParams,
      ...params,
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query: newParams,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  const selectedValue = sortOptions.find(
    item => orderParam === item.value?.order && orderbyParam === item.value?.orderby
  )


  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="group flex flex-col text-gray-700 hover:text-gray-900">
          <div className="inline-flex justify-center text-sm font-medium">
            Сортировать
            <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            />
          </div>

          {!!selectedValue?.value.order && (
            <p className="italic text-gray-500 text-sm">
              {selectedValue.name}
            </p>
          )}
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute left-0 z-10 mt-2 w-60 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {sortOptions.map(({ name, value}) => {
            const isActive = orderParam === value?.order && orderbyParam === value?.orderby;

            return (
              <MenuItem key={name}>
                <button
                  className={cn(
                    isActive ? 'font-medium text-gray-900' : 'text-gray-500',
                    'block px-4 py-2 w-full text-left text-sm data-[focus]:bg-gray-100',
                  )}
                  onClick={() => handleSelectOption(value)}
                >
                  {name}
                </button>
              </MenuItem>
            )
          })}
        </div>
      </MenuItems>
    </Menu>
  )
}

export default CategoryListSortMenu;