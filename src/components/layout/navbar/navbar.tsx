'use client';

import {useMemo, useState} from "react";
import {Button, List, MegaMenu, Navbar as FBNavbar} from 'flowbite-react';
import { HiArrowRight, HiChevronDown } from 'react-icons/hi';
import Image from "next/image";
import useProductCategories from "@/hooks/product-categories/useProductCategories";
import Link from "next/link";
import Subcategory from "@/components/layout/navbar/components/subcategory";
import {ShoppingBagIcon} from "lucide-react";

export default function Navbar() {
  const { data } = useProductCategories({});

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const parentCategories = useMemo(() => {
    // ID 320 - Номенклатура
    return data?.data.filter(pc => pc.parent === 320)
  }, [data?.data])

  const selectedSubcategories = useMemo(() => {
    return data?.data.filter(pc => pc.parent === selectedProductId)
  }, [selectedProductId])

  const handleSelectProductCategory = (productCategoryId: number) => {
    setSelectedProductId(productCategoryId);
  };

  const handleMouseLeave = () => {
    setSelectedProductId(null);
  };

  return (
    <MegaMenu className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <FBNavbar.Brand href="/">
        <Image
          src="/logos/redcrow-logo.svg"
          alt="redcrow-logo"
          width={220}
          height={27}
        />
      </FBNavbar.Brand>
      <FBNavbar.Collapse>
        {parentCategories?.map((pc) => (
          <MegaMenu.DropdownToggle
            key={pc.id}
            onMouseEnter={() => handleSelectProductCategory(pc.id)}
          >
            <Link href={`/category/${pc.slug}`}>
              {pc.name}
            </Link>
          </MegaMenu.DropdownToggle>
        ))}

        <div className="order-2 hidden items-center md:flex">
          <Button color="gray" pill>
            <ShoppingBagIcon className="h-5 w-5" />
          </Button>
        </div>
      </FBNavbar.Collapse>
      <MegaMenu.Dropdown
        hidden={!selectedProductId}
        onMouseLeave={handleMouseLeave}
      >
        <div className="mx-auto mt-6 grid max-w-screen-xl w-screen border-y border-gray-200 px-4 py-5 text-sm text-gray-500 md:grid-cols-3 md:px-6">
          <ul className="space-y-4 sm:mb-4 md:mb-0">
            {selectedSubcategories?.map(subcategory => (
              <Subcategory
                key={subcategory.id}
                subcategory={subcategory}
                productCategories={data?.data}
              />
            ))}
          </ul>
        </div>
      </MegaMenu.Dropdown>
    </MegaMenu>
  );
}
