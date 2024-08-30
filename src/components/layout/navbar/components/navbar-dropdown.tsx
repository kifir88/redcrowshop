"use client"

import {MegaMenu, Navbar} from "flowbite-react";
import Link from "next/link";
import ShoppingCartButton from "@/components/layout/navbar/components/shopping-cart-button";
import Subcategory from "@/components/layout/navbar/components/subcategory";
import {useMemo, useState} from "react";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import Image from "next/image";

export default function NavbarDropdown({productCategories}: {productCategories: ProductCategory[]}) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const parentCategories = useMemo(() => {
    // ID 320 - Номенклатура
    return productCategories.filter(pc => pc.parent === 320)
  }, [productCategories])

  const selectedSubcategories = useMemo(() => {
    return productCategories.filter(pc => pc.parent === selectedProductId)
  }, [productCategories, selectedProductId])

  const handleSelectProductCategory = (productCategoryId: number) => {
    setSelectedProductId(productCategoryId);
  };

  const handleMouseLeave = () => {
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

      <Navbar.Collapse>
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
          <ShoppingCartButton />
        </div>
      </Navbar.Collapse>
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
                productCategories={productCategories}
              />
            ))}
          </ul>
        </div>
      </MegaMenu.Dropdown>
    </>
  )
}