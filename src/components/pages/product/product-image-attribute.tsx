"use client";

import ProductImagesCarousel from "@/components/pages/product/product-images-carousel";
import ProductDetailAttributesForm from "@/components/pages/product/product-detail-attributes-form";
import {Product} from "@/types/woo-commerce/product";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {useMemo} from "react";
import {useForm} from "@mantine/form";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";

type FormValues = Record<string, ProductAttributeTerm>;

export default function ProductImageAttribute({
  product,
  productVariations,
}: {
  product: Product;
  productVariations: ProductVariation[];
}) {
  const form = useForm<FormValues>({
    initialValues: {}
  })

  const productImage = useMemo(() => {
    return productVariations
      .find(pv => pv.attributes.every((attribute) => {
        return form.values[attribute.id] && form.values[attribute.id].name === attribute.option;
      }))
      ?.image
      || product.images[0];
  }, [form.values, product.images, productVariations])

  return (
    <>
      {/* Image gallery */}
      <ProductImagesCarousel productImage={productImage} />

      <div className="mt-8 lg:col-span-5">
        {/* Attribute pickers  */}
        <ProductDetailAttributesForm attributes={product.attributes} form={form} />

        {/* Product details */}
        <div className="mt-10">
          <h2 className="text-sm font-medium text-gray-900">Описание</h2>

          <div
            className="prose prose-sm mt-4 text-gray-500"
            dangerouslySetInnerHTML={{__html: product.description || "Нет описания."}}
          />
        </div>
      </div>
    </>
  )
}