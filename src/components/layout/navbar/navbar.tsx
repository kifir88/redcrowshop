import {MegaMenu} from 'flowbite-react';
import {fetchProductCategories} from "@/libs/woocommerce-rest-api";
import NavbarDropdown from "@/components/layout/navbar/components/navbar-dropdown";

export default async function Navbar() {
  const productCategoriesData = await fetchProductCategories();

  return (
    <MegaMenu className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <NavbarDropdown productCategories={productCategoriesData.data} />
    </MegaMenu>
  );
}
