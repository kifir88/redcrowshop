'use client';

import {Attribute, Product} from "@/types/woo-commerce/product";
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

const getAvailableOptions = (
  attribute: Attribute,
  selectedValues: FormValues,
  productVariations: ProductVariation[]
): number[] => {
  // If no other attributes are selected, return all options for this attribute
  const selectedAttributeIds = Object.keys(selectedValues).filter(id => selectedValues[id]);

  // Filter variations based on selected attributes
  const filteredVariations = productVariations.filter(variation => {
    return variation.attributes.every(attr => {
      if (selectedValues[attr.id]) {
        return selectedValues[attr.id].name === attr.option;
      }
      return true;
    });
  });

  // Gather available options for this attribute based on the filtered variations
  const availableOptions: Set<number> = new Set();
  filteredVariations.forEach(variation => {
    variation.attributes.forEach(attr => {
      if (attr.id === attribute.id) {
        availableOptions.add(attr.id);
      }
    });
  });

  // Return an array of options for this attribute that are available
  return Array.from(availableOptions);
}

export default function ProductDetailAttributesForm({
  form,
  product,
  selectedProductVariation,
  productVariations,
}: {
  form: UseFormReturnType<FormValues>;
  product: Product;
  selectedProductVariation?: ProductVariation;
  productVariations: ProductVariation[]
}) {
  const [cartValues, setCartValues] = useLocalStorage<CartItem[]>("cartItems", [])

  const isOutOfStock = product.stock_status === "outofstock";

  const isAddToCartButtonDisabled = isOutOfStock || Object
    .keys(form.values)
    .length !== product.attributes.length;

  const showSuccessCartToast = () => {
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
    if (!selectedProductVariation) {
      toast.error("Такая вариация не доступна")
      return
    }

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
        imageSrc: selectedProductVariation.image?.src || null,
        imageAlt: selectedProductVariation.image?.alt || null,
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

    showSuccessCartToast()
  };

  const allAttributesField = Object.keys(form.values).length === product.attributes.length;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {isOutOfStock && (
        <p className="text-xl text-gray-900">
          Товара нет в наличии
        </p>
      )}

      {product.attributes.map(a => (
        <div key={a.id} className="mt-6">
          <AttributeAutoComplete
            label={a.name}
            attribute={a}
            allAttributesField={allAttributesField}
            value={form.values[a.id]}
            availableOptions={getAvailableOptions(a, form.values, productVariations)}
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
