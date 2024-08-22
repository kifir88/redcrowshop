'use client';

import {Product} from "@/types/woo-commerce/product";
import AttributeAutoComplete from "@/components/fields/attribute-auto-complete";
import {UseFormReturnType} from "@mantine/form";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";
import {cn} from "@/libs/utils";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {useLocalStorage} from "usehooks-ts";
import {CartItem} from "@/types/cart";

type FormValues = Record<string, ProductAttributeTerm>;

export default function ProductDetailAttributesForm({
  form,
  product,
  selectedProductVariation,
}: {
  form: UseFormReturnType<FormValues>;
  product: Product;
  selectedProductVariation?: ProductVariation;
}) {
  const [cartValues, setCartValues] = useLocalStorage<CartItem[]>("cartItems", [])

  const isAddToCartButtonDisabled = Object
    .keys(form.values)
    .length !== product.attributes.length;

  const handleSubmit = (formValue: FormValues) => {
    if (selectedProductVariation) {
      const productVariationFromCart = cartValues.find(
        (cv) => cv.productVariationId === selectedProductVariation.id
      );

      if (productVariationFromCart) {
        // Update quantity of existing item
        setCartValues((prevValue) =>
          prevValue.map((item) =>
            item.productVariationId === selectedProductVariation.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add new item to the cart
        const newCartItem = {
          productVariationId: selectedProductVariation.id,
          name: product.name,
          quantity: 1,
          imageSrc: selectedProductVariation.image?.src as string,
        };
        setCartValues((prevValue) => [...prevValue, newCartItem]);
      }
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {product.attributes.map(a => (
        <div key={a.id} className="mt-6">
          <AttributeAutoComplete
            label={a.name}
            attribute={a}
            value={form.values[a.id]}
            onChange={value => {
              form.setFieldValue(String(a.id), value)
            }}
          />
        </div>
      ))}

      <button
        type="submit"
        className={cn(
          "mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600",
          "px-8 py-3 text-base font-medium text-white",
          "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        )}
        disabled={isAddToCartButtonDisabled}
      >
        Добавить в корзину
      </button>
    </form>
  )
}
