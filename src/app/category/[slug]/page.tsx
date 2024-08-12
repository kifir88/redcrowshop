import CategoryListSortMenu from "@/components/pages/category/category-list-sort-menu";
import {fetchProductCategories, fetchProducts} from "@/libs/woocommerce-rest-api";
import ProductCard from "@/components/pages/category/product-card";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";
import Filters from "@/components/pages/category/filters";

export default async function CategorySlag({
  params: { slug },
  searchParams,
}: {
  params: { slug: string },
  searchParams: Record<string, string | string[]>
}) {
  const productCategoriesData = await fetchProductCategories({
    exclude: [320],
  })
  const currentProductCategory = productCategoriesData?.data.find(
    pc => pc.slug === slug
  )

  const remainingSearchParams = searchParams
  console.log(remainingSearchParams, "remainingSearchParams")

  const orderFiltersExist = searchParams?.order && searchParams?.orderby;
  const productsData = await fetchProducts({
    category: currentProductCategory?.id,
    order: orderFiltersExist ? searchParams?.order : undefined,
    orderby: orderFiltersExist ? searchParams?.orderby : undefined,
    attribute: ["pa_tsvet"].join(","),
    attribute_term: [309].join(",")
  })


  // const uniqueProductAttributes = Array.from(
  //   new Set(
  //     productsData?.data
  //       .map(p => p.attributes)
  //       .flat()
  //       .map(a => a.id)
  //   )
  // );

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
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:gap-x-8">
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