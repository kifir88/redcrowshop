'use client';

import {ProductCategory} from "@/hooks/product-categories/useProductCategories";
import Link from "next/link";

const NavItem = ({productCategory}: {productCategory: ProductCategory}) => {

  const href = `/category/${productCategory.slug}`

  return (
    <>
      <Link href={href}>
        {productCategory.name}
      </Link>
    </>
  )
}

export default NavItem;