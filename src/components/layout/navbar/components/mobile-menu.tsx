"use client"

import {Button, Drawer} from "flowbite-react";
import {MenuIcon} from "lucide-react";
import React, {useMemo, useState} from "react";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import Image from "next/image";
import ShoppingCartButton from "@/components/layout/navbar/components/shopping-cart-button";
import Subcategory from "@/components/layout/navbar/components/subcategory";
import Link from "next/link";

export default function MobileMenu({productCategories}: {productCategories: ProductCategory[]}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const parentCategories = useMemo(() => {
    // ID 320 - Номенклатура
    return productCategories.filter(pc => pc.parent === 320)
  }, [productCategories])


  return (
    <>
      <div className="md:hidden flex min-h-[60px] items-center justify-between mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <Button
          onClick={handleOpen}
          color="white"
          size="xs"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>

        <Link href="/">
          <Image
            src="/logos/redcrow-logo.svg"
            alt="redcrow-logo"
            width={160}
            height={22}
          />
        </Link>

        <ShoppingCartButton />
      </div>

      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header
          title="Меню"
          // titleIcon={HiCalendar}
          // titleIcon={null}
        />
        <Drawer.Items>
          <ul className="space-y-4 sm:mb-4 md:mb-0">
            {parentCategories?.map(pc => {
              const selectedSubcategories = productCategories
                .filter(subPc => subPc.parent === pc.id); // Changed variable name here

              return (
                <div key={pc.id}>
                  <Link
                    href={`/category/${pc.slug}`}
                    className="font-semibold text-gray-900"
                  >
                    {pc.name}
                  </Link>
                  <ul className="mt-4 ml-2 space-y-4 sm:mb-4 md:mb-0">
                    {selectedSubcategories.map(subcategory => (
                      <Subcategory
                        key={subcategory.id}
                        subcategory={subcategory}
                        productCategories={productCategories}
                      />
                    ))}
                  </ul>
                </div>
              )
            })}
          </ul>
        </Drawer.Items>
      </Drawer>
    </>
  )
}