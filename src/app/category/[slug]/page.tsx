import CategoryListSortMenu from "@/components/pages/category/category-list-sort-menu";
import {fetchProductCategories, fetchProducts} from "@/libs/woocommerce-rest-api";
import ProductCard from "@/components/pages/category/product-card";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";
import Filters from "@/components/pages/category/filters";

export default async function CategorySlag({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const productCategoriesData = await fetchProductCategories()
  const currentProductCategory = productCategoriesData?.data.find(
    pc => pc.slug === slug
  )
  const productsData = await fetchProducts({
    category: currentProductCategory?.id,
  })

  const breadCrumbItems = getCategoryHierarchyBySlug(productCategoriesData?.data, slug)
    .map(pc => ({name: pc.name, href: `/category/${pc.slug}`}))

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div>
        <Breadcrumb items={breadCrumbItems} />
      </div>

      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {currentProductCategory?.name}
        </h1>

        <div className="flex items-center">
          <CategoryListSortMenu />

          {/*<button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">*/}
          {/*  <span className="sr-only">View grid</span>*/}
          {/*  <Squares2X2Icon aria-hidden="true" className="h-5 w-5" />*/}
          {/*</button>*/}
          {/*<button*/}
          {/*  type="button"*/}
          {/*  // onClick={() => setMobileFiltersOpen(true)}*/}
          {/*  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"*/}
          {/*>*/}
          {/*  <span className="sr-only">Filters</span>*/}
          {/*  <FunnelIcon aria-hidden="true" className="h-5 w-5" />*/}
          {/*</button>*/}
        </div>
      </div>

      <section aria-labelledby="products-heading" className="pb-24 pt-6">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <Filters />

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
            {productsData?.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}