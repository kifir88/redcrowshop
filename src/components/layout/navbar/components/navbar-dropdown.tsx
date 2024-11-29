"use client"

import {MegaMenu, Navbar} from "flowbite-react";
import Link from "next/link";
import ShoppingCartButton from "@/components/layout/navbar/components/shopping-cart-button";
import Subcategory from "@/components/layout/navbar/components/subcategory";
import {useMemo, useState} from "react";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import Image from "next/image";
import {cn} from "@/libs/utils";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";

export default function NavbarDropdown({
  productCategories,
  currencyRates,
}: {
  productCategories: ProductCategory[];
  currencyRates: CustomCurrencyRates;
}) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const parentCategories = useMemo(() => {
    // ID 320 - Номенклатура
    return productCategories.filter(pc => pc.parent === 378)
  }, [productCategories])

  const selectedSubcategories = useMemo(() => {
    return productCategories.filter(pc => pc.parent === selectedProductId)
  }, [productCategories, selectedProductId])

  const handleSelectProductCategory = (productCategoryId: number) => {
    setSelectedProductId(productCategoryId);
  };
  const handleClearSelectedProductCategory = () => {
    setSelectedProductId(null);
  };

  return (
    <>
      <Navbar.Brand href="/">
        <Image
          src="/logos/redcrow-logo.svg"
          alt="redcrow-logo"
          width={220}
          height={27}
        />
      </Navbar.Brand>

      <Navbar.Collapse className="flex flex-1">
        <div className="flex flex-1 justify-evenly gap-10 ml-10">
          <a href={`/shop`} onMouseEnter={handleClearSelectedProductCategory}>
            Магазин
          </a>

          {parentCategories?.map((pc) => (
            <MegaMenu.DropdownToggle
              key={pc.id}
              onMouseEnter={() => handleSelectProductCategory(pc.id)}
              className="w-auto"
            >
              <a href={`/category/${pc.slug}`}>
                {pc.name}
              </a>
            </MegaMenu.DropdownToggle>
          ))}
        </div>

        <div className="order-2 hidden items-center md:flex">
          <ShoppingCartButton currencyRates={currencyRates} />
        </div>
      </Navbar.Collapse>
      <MegaMenu.Dropdown
        hidden={!selectedProductId}
        onMouseLeave={handleClearSelectedProductCategory}
        className="w-full"
      >
        <div
          className={cn(
            "mt-6 grid max-w-screen-xl w-full text-sm text-gray-500",
            "mx-auto px-4 py-5 md:grid-cols-3 md:px-6 border-y border-gray-200 shadow-md"
          )}
        >
          <ul className="space-y-4 sm:mb-4 md:mb-0">
            {selectedSubcategories?.map(subcategory => (
              <Subcategory
                key={subcategory.id}
                subcategory={subcategory}
                productCategories={productCategories}
              />
            ))}
          </ul>
        </div>
      </MegaMenu.Dropdown>
    </>
  )
}