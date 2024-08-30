import Link from "next/link";
import {List} from "flowbite-react";
import {ProductCategory} from "@/types/woo-commerce/product-category";

const Subcategory = ({
  subcategory,
  productCategories,
  handleCloseMobileMenu,
}: {
  subcategory: ProductCategory,
  productCategories?: ProductCategory[],
  handleCloseMobileMenu?: () => void,
}) => {
  const collectionProductCategories = productCategories?.filter(
    pc => pc.parent === subcategory.id
  )

  return (
    <>
      <li key={subcategory.id}>
        <Link
          href={`/category/${subcategory.slug}`}
          className="mb-2 md:font-semibold text-gray-700 md:text-gray-900"
          onClick={handleCloseMobileMenu}
        >
          {subcategory.name}
        </Link>
      </li>
      {!!collectionProductCategories?.length && (
        <List>
          {collectionProductCategories?.map(collection => (
            <List.Item key={collection.id}>
              <Link
                href={`/category/${collection.slug}`}
                className="hover:text-primary-600 dark:hover:text-primary-500"
                onClick={handleCloseMobileMenu}
              >
                {collection.name}
              </Link>
            </List.Item>
          ))}
        </List>
      )}
    </>
  )
}

export default Subcategory;