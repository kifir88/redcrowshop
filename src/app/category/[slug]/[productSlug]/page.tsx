import {fetchProductCategories, fetchProducts, fetchProductVariations} from "@/libs/woocommerce-rest-api";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";
import ProductCard from "@/components/pages/category/product-card";
import ProductImageAttribute from "@/components/pages/product/product-image-attribute";

export default async function Product({
  params: { slug, productSlug },
}: {
  params: { slug: string, productSlug: string },
}) {
  const productsData = await fetchProducts({
    slug: productSlug,
  })
  const productData = productsData?.data?.[0];

  const productsRecommendedData = await fetchProducts({
    include: productData.related_ids,
    per_page: 3,
  })
  const productCategoriesData = await fetchProductCategories({
    exclude: [320],
  })
  const productVariationsData = await fetchProductVariations(productData.id, {
    parent: productData.id,
    per_page: 50
  })

  const breadCrumbItems = getCategoryHierarchyBySlug(productCategoriesData?.data, slug)
    .map(pc => ({name: pc.name, href: `/category/${pc.slug}`}))

  return (
    <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <Breadcrumb
        items={breadCrumbItems}
        productName={productData?.name}
      />

      <div className="">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex flex-col md:flex-row justify-between">
              <h1 className="text-xl font-medium text-gray-900">{productData.name}</h1>
              <div
                className="text-xl font-medium text-gray-900"
                dangerouslySetInnerHTML={{__html: productData.price_html}}
              />
            </div>
          </div>

          <ProductImageAttribute
            product={productData}
            productVariations={productVariationsData.data}
          />

        </div>
      </div>

      <div className="mt-20 mb-10">
        <h1 className="text-xl font-medium text-gray-900 mb-6">
          Вам также может понравится
        </h1>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:gap-x-8">
          {productsRecommendedData?.data.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
