"use client";

import ProductImagesCarousel from "@/components/pages/product/product-images-carousel";
import ProductDetailAttributesForm from "@/components/pages/product/product-detail-attributes-form";
import { Image, Product } from "@/types/woo-commerce/product";
import { ProductVariation } from "@/types/woo-commerce/product-variation";
import { useForm } from "@mantine/form";
import { ProductAttributeTerm } from "@/types/woo-commerce/product-attribute-term";
import ProductPrice from "@/components/pages/product/product-price";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";

type FormValues = Record<string, ProductAttributeTerm | null>;

export default function ProductInfo({
  product,
  productVariations,
  currencyRates,
  allProductImages,
}: {
  product: Product;
  productVariations: ProductVariation[];
  currencyRates: CustomCurrencyRates;
  allProductImages: any;
}) {

  const form = useForm<FormValues>({
    initialValues: {}
  })
  var selectedProductVariation = productVariations
    .find(pv => pv.attributes.every((attribute) => {
      return form.values[attribute.id] && form.values[attribute.id]?.name === attribute.option;
    }));


  const selectedProductVariationImage: Image | null = (selectedProductVariation?.image || null);

  var idx = null;
  if (selectedProductVariationImage != null) {
    idx = allProductImages.indexOf(selectedProductVariationImage);

  }

  return (
    <>
      <div className="lg:col-span-5 lg:col-start-8">
        <div className="flex flex-col md:flex-row justify-between">
          <h1 className="text-xl font-medium text-gray-900 pr-2">{product.name}</h1>
          <ProductPrice
            product={product}
            currencyRates={currencyRates}
            selectedProductVariation={selectedProductVariation}
            variationBase={productVariations[0] ?? null}
          />
        </div>
      </div>

      {/* Image gallery */}
      <ProductImagesCarousel images={allProductImages} productImageIndex={idx} />

      <div className="mt-8 lg:col-span-5">
        {/* Attribute pickers  */}
        <ProductDetailAttributesForm
          product={product}
          selectedProductVariation={selectedProductVariation}
          form={form}
          productVariations={productVariations}
        />

        {/* Product details */}
        <div className="mt-10">
          <h2 className="text-sm font-medium text-gray-900">Описание</h2>

          <div
            className="prose prose-sm mt-4 text-gray-500"
            dangerouslySetInnerHTML={{ __html: product.description || "Нет описания." }}
          />
        </div>
      </div>
    </>
  )
}