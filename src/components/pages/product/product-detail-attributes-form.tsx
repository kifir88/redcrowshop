'use client';

import {Product} from "@/types/woo-commerce/product";
import AttributeAutoComplete from "@/components/fields/attribute-auto-complete";
import {UseFormReturnType} from "@mantine/form";
import {ProductAttributeTerm} from "@/types/woo-commerce/product-attribute-term";
import {ProductVariation} from "@/types/woo-commerce/product-variation";
import {useLocalStorage} from "usehooks-ts";
import {CartItem} from "@/types/cart";
import {Button, Toast} from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";

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

  const isOutOfStock = product.stock_status === "outofstock";

  const isAddToCartButtonDisabled = isOutOfStock || Object
    .keys(form.values)
    .length !== product.attributes.length;

  const showCartToast = () => {
    toast.custom((t) => (
      <Toast className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <div className="text-sm font-normal">Товар добавлен в корзину.</div>
        <div className="ml-auto flex items-center space-x-2">
          <div>
            <Button
              as={Link}
              href="/cart"
              size="sm"
              color="dark"
              onClick={() => toast.dismiss(t.id)}
            >
              Перейти
            </Button>
          </div>
          <Toast.Toggle onClick={() => toast.dismiss(t.id)} />
        </div>
      </Toast>
    ))
  }

  const handleSubmit = (formValues: FormValues) => {
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
          productId: product.id,
          productVariationId: selectedProductVariation.id,
          name: product.name,
          quantity: 1,
          price: Number(selectedProductVariation.price),
          imageSrc: selectedProductVariation.image?.src as string,
          imageAlt: selectedProductVariation.image?.alt as string,
          attributes: Object.keys(formValues).map(attributeId => {
            const attributeName = product.attributes
              .find(a => a.id === Number(attributeId))
              ?.name;
            const attributeVariation = formValues[attributeId].name;

            return `${attributeName} ${attributeVariation}`
          }),
        };
        setCartValues((prevValue) => [...prevValue, newCartItem]);
      }
    }

    showCartToast()
  };

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

      <Button
        type="submit"
        className="mt-8"
        color="dark"
        disabled={isAddToCartButtonDisabled}
        fullSized
      >
        Добавить в корзину
      </Button>
    </form>
  )
}
