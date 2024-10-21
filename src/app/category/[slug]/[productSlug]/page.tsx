import {
  fetchCurrencyRates,
  fetchProductCategories,
  fetchProducts,
  fetchProductVariations
} from "@/libs/woocommerce-rest-api";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";
import ProductCard from "@/components/pages/category/product-card";
import ProductImageAttribute from "@/components/pages/product/product-image-attribute";
import {Product} from "@/types/woo-commerce/product";
import ProductPrice from "@/components/pages/product/product-price";
import {Metadata, ResolvingMetadata} from "next";

interface ProductPageProps {
  params: {
    slug: string,
    productSlug: string
  },
}

export async function generateMetadata(
  {
    params: { productSlug },
  }: ProductPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const productsData = await fetchProducts({
    slug: productSlug,
  })
  const productData = productsData?.data?.[0];
  const productVariationsData = await fetchProductVariations(productData.id, {
    parent: productData.id,
    per_page: 50
  })

  const formattedVariationsForDescription = productVariationsData.data
    .map(pv => {
      const formattedOptions = pv.attributes
        .map(a => `${a.name} ${a.option}`.toLowerCase())
        .join(" и ")

      return formattedOptions
    })
    .join(", ");

  const title = `${productData?.name}`
  const description = `${productData?.name.toLowerCase()} ${formattedVariationsForDescription}`;

  return {
    title,
    description,
    keywords: [
      "RedCrow Казахстан",
      productData?.name,
      formattedVariationsForDescription,
    ]
  }
}


export default async function ProductPage({
  params: { slug, productSlug },
}: ProductPageProps) {
  const productsData = await fetchProducts({
    slug: productSlug,
  })
  const productData = productsData?.data?.[0];

  const [
    currencyRatesData,
    productsRecommendedData,
    productCategoriesData,
    productVariationsData,
  ] = await Promise.all([
    fetchCurrencyRates(),
    fetchProducts({
      include: productData.related_ids,
      per_page: 3,
    }),
    fetchProductCategories({
      exclude: [320],
    }),
    fetchProductVariations(productData.id, {
      parent: productData.id,
      stock_status: "instock",
      per_page: 50
    })
  ])

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
              <ProductPrice product={productData} currencyRates={currencyRatesData.data}  />
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
          {productsRecommendedData?.data.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              currencyRates={currencyRatesData.data}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
