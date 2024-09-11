import CategoryListSortMenu from "@/components/pages/category/category-list-sort-menu";
import {
  fetchCurrencyRates, fetchCustomProductAttributes,
  fetchProductCategories,
  fetchProducts
} from "@/libs/woocommerce-rest-api";
import ProductCard from "@/components/pages/category/product-card";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";
import Filters from "@/components/pages/category/filters";
import CategoryListPagination from "@/components/pages/category/category-list-pagination";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import {Product} from "@/types/woo-commerce/product";
import {cn} from "@/libs/utils";
import MobileFilters from "@/components/pages/category/mobile-filters";
import CurrencySelect from "@/components/pages/category/category-list-currency";
import {Metadata, ResolvingMetadata} from "next";

interface ProductCategoryPageProps {
  params: { slug: string },
  searchParams: Record<string, string>
}

export async function generateMetadata(
  { params }: ProductCategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const productCategoryData = await fetchProductCategories({
    slug: params.slug
  })
  const productCategory = productCategoryData.data[0]

  const productAttributesData = await fetchCustomProductAttributes({
    category_name: productCategory.slug,
  })

  const formattedAttributes = productAttributesData.data
    .map(pa => {
      const formattedAttributes = pa.options
        .map(a => a.name)
        .join(" и ")

      return `${pa.name}: ${formattedAttributes}`
    })
    .join(", ")
  const formattedAttributesForDescription = productAttributesData.data
    .map(pa => {
      const formattedAttributes = pa.options
        .map(a => a.name.toLowerCase())
        .join(" и ")

      return `${pa.name.toLowerCase()} ${formattedAttributes}`
    })
    .join(", ")

  const title = `RedCrow Казахстан ${productCategory.name} - ${formattedAttributes}`;
  const description = `Откройте для себя ${productCategory.name.toLowerCase()} ${formattedAttributesForDescription}. Идеальный выбор для стильного образа.`;

  return {
    title: title,
    description: description,
    keywords: [
      "RedCrow Казахстан",
      productCategory.name,
      productCategory.name.toLowerCase(),
      productCategory.description,
      productCategory.description.toLowerCase(),
    ]
  }
}


export default async function ProductCategoryPage({
  params: { slug },
  searchParams,
}: ProductCategoryPageProps) {
  const currencyRatesData = await fetchCurrencyRates();
  const productCategoriesData = await fetchProductCategories({
    exclude: [320],
  });
  const currentProductCategory = productCategoriesData?.data.find(
    (pc: ProductCategory) => pc.slug === slug
  );

  const {
    search: searchParam,
    max_price: maxPriceParam,
    min_price: minPriceParam,
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
    per_page: 12,
    search: searchParam ? searchParam : undefined,
    max_price: maxPriceParam ? maxPriceParam : undefined,
    min_price: minPriceParam ? minPriceParam : undefined,
    ...formattedSearchParams,
  })
  const productCategoryMaxPriceData = await fetchProducts({
    category: currentProductCategory?.id,
    per_page: 1,
    order: "desc",
    orderby: "price"
  })
  const productCategoryMaxPrice = productCategoryMaxPriceData.data[0]?.price;
  const productCategoryMaxPriceValue = productCategoryMaxPrice ? Number(productCategoryMaxPrice) : 0;

  const totalPages: string = productsData?.headers["x-wp-totalpages"]

  const breadCrumbItems = getCategoryHierarchyBySlug(productCategoriesData?.data, slug)
    .map(pc => ({name: pc.name, href: `/category/${pc.slug}`}))

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div>
        <Breadcrumb items={breadCrumbItems} />
      </div>

      <div className="flex items-baseline justify-between pb-6 pt-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {currentProductCategory?.name}
        </h1>
      </div>

      <section aria-labelledby="products-heading" className="pb-24 pt-6">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Desktop Filters */}
          <Filters
            productSlug={slug}
            className="hidden lg:block"
            productMaxPrice={productCategoryMaxPriceValue}
            currencyRates={currencyRatesData.data}
          />

          {/* Product grid */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3 h-min space-y-6">
            <div
              className={cn(
                "flex flex-col md:flex-row justify-between md:items-center gap-y-5"
              )}
            >
              <div className="flex justify-between items-center w-full h-min">
                <CategoryListSortMenu />

                <CurrencySelect />
              </div>

              <MobileFilters
                productSlug={slug}
                productMaxPrice={productCategoryMaxPriceValue}
                currencyRates={currencyRatesData.data}
              />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-8">
              {!productsData?.data.length && (
                <div
                  className={cn(
                    "col-span-1 sm:col-span-2 md:col-span-3 h-min",
                    "flex justify-center items-center"
                  )}
                >
                  <p className="text-center text-balance text-lg md:text-xl font-medium text-gray-900">
                    Товаров по заданным параметрам не найдено
                  </p>
                </div>
              )}
              {productsData?.data.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currencyRates={currencyRatesData.data}
                />
              ))}
            </div>
          </div>

          <div/>

          <CategoryListPagination
            currentPage={pageParam || "1"}
            totalPages={totalPages}
          />
        </div>
      </section>
    </main>
  )
}