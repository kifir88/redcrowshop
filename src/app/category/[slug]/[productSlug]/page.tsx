import ProductDetailPage from "@/components/pages/product/product-detail-page";
import {fetchProductCategories, fetchProducts} from "@/libs/woocommerce-rest-api";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";

export default async function Product({
  params: { slug, productSlug },
}: {
  params: { slug: string, productSlug: string },
}) {
  const productsData = await fetchProducts({
    slug: productSlug,
  })
  const productData = productsData?.data?.[0];

  const productCategoriesData = await fetchProductCategories({
    exclude: [320],
  })
  const breadCrumbItems = getCategoryHierarchyBySlug(productCategoriesData?.data, slug)
    .map(pc => ({name: pc.name, href: `/category/${pc.slug}`}))

  return (
    <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <Breadcrumb
        items={breadCrumbItems}
        productName={productData?.name}
      />

      <ProductDetailPage />
    </div>
  )
}
