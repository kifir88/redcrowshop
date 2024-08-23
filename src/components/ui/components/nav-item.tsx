'use client';

import Link from "next/link";
import {ProductCategory} from "@/types/woo-commerce/product-category";

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