"use client";

import ProductImagesCarousel from "@/components/pages/product/product-images-carousel";
import ProductDetailAttributesForm from "@/components/pages/product/product-detail-attributes-form";
import {Image, Product} from "@/types/woo-commerce/product";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {useForm} from "@mantine/form";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";
import ProductPrice from "@/components/pages/product/product-price";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";

type FormValues = Record<string, ProductAttributeTerm | null>;

export default function ProductImageAttribute({
  product,
  productVariations,
  currencyRates,
}: {
  product: Product;
  productVariations: ProductVariation[];
  currencyRates: CustomCurrencyRates
}) {
  const form = useForm<FormValues>({
    initialValues: {}
  })

  var selectedProductVariation = productVariations
    .find(pv => pv.attributes.every((attribute) => {
      return form.values[attribute.id] && form.values[attribute.id]?.name === attribute.option;
    }));

  var equalBaseImage = false;

  if (selectedProductVariation)
  {
    equalBaseImage = product.images.find((gg) => selectedProductVariation?.image?.src == gg.src) != null;
  }

    // Если точного совпадения нет, ищем вариацию с изображением, игнорируя "Размер", но проверяя остальные атрибуты
    if (selectedProductVariation?.image == null || equalBaseImage) {
      selectedProductVariation = productVariations.find(pv =>
          pv.image != null && product.images.find((gg) => pv?.image?.src == gg.src) == null &&
          pv.attributes
              .every(attribute => attribute.name.toLowerCase() == "размер" || (
                  form.values[attribute.id] && form.values[attribute.id]?.name === attribute.option)
              )
      );
    }


  const selectedProductVariationImage: Image | null = selectedProductVariation?.image || null;

  const productVariationImages = productVariations
    ?.map(i => i.image)
    ?.filter(i => i !== null && product.images.find((gg) => i.src == gg.src) == null);

  const productImages = product.images
      ?.map(i => i)
      ?.filter(i => i !== null);


  const allProductImages = productImages.concat(productVariationImages);


  return (
    <>
      <div className="lg:col-span-5 lg:col-start-8">
        <div className="flex flex-col md:flex-row justify-between">
          <h1 className="text-xl font-medium text-gray-900">{product.name}</h1>
          <ProductPrice
            product={product}
            currencyRates={currencyRates}
            selectedProductVariation={selectedProductVariation}
          />
        </div>
      </div>

      {/* Image gallery */}
      <ProductImagesCarousel images={allProductImages} productImage={selectedProductVariationImage || null}/>

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
            dangerouslySetInnerHTML={{__html: product.description || "Нет описания."}}
          />
        </div>
      </div>
    </>
  )
}