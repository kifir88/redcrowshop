'use client';

import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {cn} from "@/libs/utils";

const sortOptions = [
  { name: 'По умолчанию', href: '#', current: true },
  { name: 'По цене: от низкой к высокой', href: '#', current: false },
  { name: 'По цене: от высокой к низкой', href: '#', current: false },
  { name: 'По названию: По возрастанию', href: '#', current: false },
  { name: 'По названию: По убыванию', href: '#', current: false },
]

const CategoryListSortMenu = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          Сортировать
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          {sortOptions.map((option) => (
            <MenuItem key={option.name}>
              <a
                href={option.href}
                className={cn(
                  option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                  'block px-4 py-2 text-sm data-[focus]:bg-gray-100',
                )}
              >
                {option.name}
              </a>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}

export default CategoryListSortMenu;