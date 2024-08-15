import CategoryListSortMenu from "@/components/pages/category/category-list-sort-menu";
import {fetchProductCategories, fetchProducts} from "@/libs/woocommerce-rest-api";
import ProductCard from "@/components/pages/category/product-card";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";
import Filters from "@/components/pages/category/filters";
import CategoryListPagination from "@/components/pages/category/category-list-pagination";

export default async function Category({
  params: { slug },
  searchParams,
}: {
  params: { slug: string },
  searchParams: Record<string, string>
}) {
  const productCategoriesData = await fetchProductCategories({
    exclude: [320],
  })
  const currentProductCategory = productCategoriesData?.data.find(
    pc => pc.slug === slug
  )

  const {
    page: pageParam,
    order: orderSearchParam,
    orderby: orderbySearchParam,
    ...attributeSearchParams
  } = searchParams;

  const formattedSearchParams = Object
    .entries(attributeSearchParams)
    .reduce((acc, [key, value]) => {
      acc[`attr-${key}`] = value;
      return acc;
    }, {} as Record<string, string>);

  const orderFiltersExist = orderSearchParam && orderbySearchParam;
  const productsData = await fetchProducts({
    category: currentProductCategory?.id,
    order: orderFiltersExist ? orderSearchParam : undefined,
    orderby: orderFiltersExist ? orderbySearchParam : undefined,
    page: pageParam ? Number(pageParam) : undefined,
    ...formattedSearchParams,
  })

  const totalPages: string = productsData?.headers["x-wp-totalpages"]

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

          <div />

          <CategoryListPagination
            currentPage={pageParam || "1"}
            totalPages={totalPages}
          />
        </div>
      </section>
    </main>
  )
}