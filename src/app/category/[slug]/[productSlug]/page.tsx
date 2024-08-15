import ProductDetailAttributesForm from "@/components/pages/product/product-detail-attributes-form";
import {fetchProductCategories, fetchProducts} from "@/libs/woocommerce-rest-api";
import Breadcrumb from "@/components/breadcrumb";
import {getCategoryHierarchyBySlug} from "@/libs/helper-functions";
import {StarIcon} from "@heroicons/react/20/solid";
import {cn} from "@/libs/utils";
import {Radio, RadioGroup} from "@headlessui/react";

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

      <div className="">
        <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex justify-between">
              <h1 className="text-xl font-medium text-gray-900">{productData.name}</h1>
              <div
                className="text-xl font-medium text-gray-900"
                dangerouslySetInnerHTML={{__html: productData.price_html}}
              />
            </div>
            {/* Reviews */}
            {/*<div className="mt-4">*/}
            {/*  <h2 className="sr-only">Reviews</h2>*/}
            {/*  <div className="flex items-center">*/}
            {/*    <p className="text-sm text-gray-700">*/}
            {/*      {product.rating}*/}
            {/*      <span className="sr-only"> out of 5 stars</span>*/}
            {/*    </p>*/}
            {/*    <div className="ml-1 flex items-center">*/}
            {/*      {[0, 1, 2, 3, 4].map((rating) => (*/}
            {/*        <StarIcon*/}
            {/*          key={rating}*/}
            {/*          aria-hidden="true"*/}
            {/*          className={cn(*/}
            {/*            product.rating > rating ? 'text-yellow-400' : 'text-gray-200',*/}
            {/*            'h-5 w-5 flex-shrink-0',*/}
            {/*          )}*/}
            {/*        />*/}
            {/*      ))}*/}
            {/*    </div>*/}
            {/*    <div aria-hidden="true" className="ml-4 text-sm text-gray-300">*/}
            {/*      ·*/}
            {/*    </div>*/}
            {/*    <div className="ml-4 flex">*/}
            {/*      <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">*/}
            {/*        See all {product.reviewCount} reviews*/}
            {/*      </a>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          {/* Image gallery */}
          <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
            <h2 className="sr-only">Images</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
              {productData.images.map((image, index) => (
                <img
                  key={image.id}
                  alt={image.alt}
                  src={image.src}
                  className={cn(
                    index === 0 ? 'lg:col-span-2 lg:row-span-2' : 'hidden lg:block',
                    'rounded-lg',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 lg:col-span-5">
            {/* Attribute pickers  */}
            <ProductDetailAttributesForm attributes={productData.attributes} />

            {/* Product details */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Описание</h2>

              <div
                className="prose prose-sm mt-4 text-gray-500"
              >
                {productData.description || "Нет описания."}
              </div>
            </div>

            {/*<div className="mt-8 border-t border-gray-200 pt-8">*/}
            {/*  <h2 className="text-sm font-medium text-gray-900">Fabric &amp; Care</h2>*/}

            {/*  <div className="prose prose-sm mt-4 text-gray-500">*/}
            {/*    <ul role="list">*/}
            {/*      {productData.details.map((item) => (*/}
            {/*        <li key={item}>{item}</li>*/}
            {/*      ))}*/}
            {/*    </ul>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/* Policies */}
            {/*<section aria-labelledby="policies-heading" className="mt-10">*/}
            {/*  <h2 id="policies-heading" className="sr-only">*/}
            {/*    Our Policies*/}
            {/*  </h2>*/}

            {/*  <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">*/}
            {/*    {policies.map((policy) => (*/}
            {/*      <div key={policy.name} className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">*/}
            {/*        <dt>*/}
            {/*          <policy.icon aria-hidden="true" className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" />*/}
            {/*          <span className="mt-4 text-sm font-medium text-gray-900">{policy.name}</span>*/}
            {/*        </dt>*/}
            {/*        <dd className="mt-1 text-sm text-gray-500">{policy.description}</dd>*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*  </dl>*/}
            {/*</section>*/}
          </div>
        </div>
      </div>
    </div>
  )
}
