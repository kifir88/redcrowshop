"use client"

import {Button, Drawer} from "flowbite-react";
import {MenuIcon} from "lucide-react";
import React, {useMemo, useState} from "react";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import Image from "next/image";
import ShoppingCartButton from "@/components/layout/navbar/components/shopping-cart-button";
import Subcategory from "@/components/layout/navbar/components/subcategory";
import Link from "next/link";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import ClientOnly from "@/components/client_only";

export default function MobileMenu({
  productCategories,
  currencyRates,
}: {
  productCategories: ProductCategory[];
  currencyRates: CustomCurrencyRates;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const parentCategories = useMemo(() => {
    // ID 320 - Номенклатура
    return productCategories.filter(pc => pc.parent === 378).filter(pc=> pc.slug!=='musor')
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

        <ClientOnly>
          <ShoppingCartButton currencyRates={currencyRates} />
        </ClientOnly>
      </div>

      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header
          title="Меню"
        />
        <Drawer.Items>
          <ul className="mt-4 space-y-4 sm:mb-4 md:mb-0">
            <Link
                href={`/shop`}
                className="font-semibold text-gray-900"
                onClick={handleClose}
            >
              Магазин
            </Link>

            <div key="sale-item">
              <Link
                  href={`/shop?sale=1`}
                  className="font-semibold text-red-500"
                  onClick={handleClose}
              >outlet</Link>
            </div>

              {parentCategories?.map(pc => {
                const selectedSubcategories = productCategories
                    .filter(subPc => subPc.parent === pc.id); // Changed variable name here

                return (
                    <div key={pc.id}>
                      <Link
                          href={`/category/${pc.slug}`}
                          className="font-semibold text-gray-900"
                          onClick={handleClose}
                      >
                        {pc.name}
                      </Link>
                      <ul className="mt-4 ml-2 space-y-4 sm:mb-4 md:mb-0">
                        {selectedSubcategories.map(subcategory => (
                            <Subcategory
                                key={subcategory.id}
                                subcategory={subcategory}
                                productCategories={productCategories}
                                handleCloseMobileMenu={handleClose}
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