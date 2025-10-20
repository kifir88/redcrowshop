'use client';

import {useState} from "react";
import Image from "next/image";
import useProductCategories from "@/hooks/product-categories/useProductCategories";
import {cn} from "@/libs/utils";
import DropdownMenu from "@/components/ui/components/dropdown-menu";


const Navbar = () => {
  const {data, isLoading, isError} = useProductCategories({
    parent: 378, // Номенклатура
  })

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  const toggleOpenState = (index: number) => {
    setOpenDropdownIndex(
      prev => prev === index ? null : index
    )
  };

  const closeAllDropdowns = () => {
    setOpenDropdownIndex(null);
  };

  const navItems = data?.data?.filter(pc => pc.slug !== 'musor').map(pc => {
      if(pc.name==='Мусор'){
          return null;
      }
      return (
            <DropdownMenu
              key={pc.id}
              navItem={pc}
              isOpen={openDropdownIndex === pc.id}
              toggleOpen={() => toggleOpenState(pc.id)}
              toggleClose={closeAllDropdowns}
            />
    );
  });

  return (
    <nav className="sticky top-0 z-50 w-full inset-x-0 mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <Image
          src="/logos/redcrow-logo.svg"
          alt="redcrow-logo"
          width={220}
          height={27}
        />

        <div
          className={cn(
            "z-30 hidden justify-evenly",
            "md:top-0 md:mt-0 md:flex md:h-fit md:w-full md:items-center md:overflow-y-visible md:bg-inherit md:text-main"
          )}
        >
          {navItems}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;