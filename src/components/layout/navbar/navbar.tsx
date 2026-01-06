import { MegaMenu } from 'flowbite-react';
import { fetchCurrencyRates, fetchProductCustomCategories } from "@/libs/woocommerce-rest-api";
import NavbarDropdown from "@/components/layout/navbar/components/navbar-dropdown";
import MobileMenu from "@/components/layout/navbar/components/mobile-menu";
import { cn } from "@/libs/utils";
import { ProductCategory } from "@/types/woo-commerce/product-category";

export default async function Navbar() {
  const [
    currencyRatesData,
    productCategoriesData,
  ] = await Promise.all([
    fetchCurrencyRates(),
    fetchProductCustomCategories({
      order: "desc",
      orderby: "name", exclude: [378], per_page: 50
    })
  ]);

  const filteredProductCategories = productCategoriesData?.data?.filter(
    (pc: ProductCategory) => pc.slug !== 'musor' && pc.count > 0
  );

  return (
    <>
      <div className="relative md:h-[90px] z-50">
        <MegaMenu
          className={cn(
            "absolute left-0 top-0 right-0 hidden md:block",
            "mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 "
          )}
        >
          <NavbarDropdown
            productCategories={filteredProductCategories}
            currencyRates={currencyRatesData.data}
          />
        </MegaMenu>
      </div>

      <MobileMenu
        productCategories={filteredProductCategories}
        currencyRates={currencyRatesData.data}
      />
    </>
  );
}
