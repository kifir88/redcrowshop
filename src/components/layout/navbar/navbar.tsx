import {MegaMenu} from 'flowbite-react';
import {fetchProductCategories} from "@/libs/woocommerce-rest-api";
import NavbarDropdown from "@/components/layout/navbar/components/navbar-dropdown";
import MobileMenu from "@/components/layout/navbar/components/mobile-menu";
import {cn} from "@/libs/utils";

export default async function Navbar() {
  const productCategoriesData = await fetchProductCategories();

  return (
    <>
      <div className="relative md:h-[72px] z-50">
        <MegaMenu
          className={cn(
            "absolute left-0 top-0 right-0 hidden md:block",
            "mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 "
          )}
        >
          <NavbarDropdown productCategories={productCategoriesData.data} />
        </MegaMenu>
      </div>

      <MobileMenu productCategories={productCategoriesData.data} />
    </>
  );
}
