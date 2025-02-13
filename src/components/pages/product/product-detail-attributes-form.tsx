'use client';

import { Product } from "@/types/woo-commerce/product";
import AttributeAutoComplete from "@/components/fields/attribute-auto-complete";
import { UseFormReturnType } from "@mantine/form";
import { ProductAttributeTerm } from "@/types/woo-commerce/product-attribute-term";
import { ProductVariation } from "@/types/woo-commerce/product-variation";
import { useLocalStorage } from "usehooks-ts";
import { CartItem } from "@/types/cart";
import { Button, Toast } from "flowbite-react";
import Link from "next/link";
import toast from "react-hot-toast";

type FormValues = Record<string, ProductAttributeTerm | null>;

export default function ProductDetailAttributesForm({
                                                      form,
                                                      product,
                                                      selectedProductVariation,
                                                      productVariations,
                                                    }: {
  form: UseFormReturnType<FormValues>;
  product: Product;
  selectedProductVariation?: ProductVariation;
  productVariations: ProductVariation[];
}) {
  const [cartValues, setCartValues] = useLocalStorage<CartItem[]>("cartItems", []);

  const isOutOfStock = product.stock_status === "outofstock";

  const isAddToCartButtonDisabled =
      isOutOfStock || Object.keys(form.values).length !== product.attributes.length;

  const showSuccessCartToast = () => {
    toast.custom((t) => (
        <Toast className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}>
          <div className="text-sm font-normal">Товар добавлен в корзину.</div>
          <div className="ml-auto flex items-center space-x-2">
            <div>
              <Button as={Link} href="/cart" size="sm" color="dark" onClick={() => toast.dismiss(t.id)}>
                Перейти
              </Button>
            </div>
            <Toast.Toggle onClick={() => toast.dismiss(t.id)}/>
          </div>
        </Toast>
    ));
  };

  const handleSubmit = (formValues: FormValues) => {

    if (!selectedProductVariation) {
      if (product.type === "simple") {
        const simpleProductFromCart = cartValues.find((cv) => cv.productId === product.id);
        const stockQuantity = product.stock_quantity || 0;

        if (simpleProductFromCart) {
          const newQuantity = simpleProductFromCart.quantity + 1;

          if (newQuantity <= stockQuantity) {
            setCartValues((prevValue) =>
                prevValue.map((item) =>
                    item.productId === product.id ? {...item, quantity: newQuantity} : item
                )
            );
            showSuccessCartToast();
          } else {
            toast.error(
                `Товара с названием ${product.name} в наличии только ${stockQuantity}`
            );
          }
        } else {
          if (stockQuantity > 0) {
            const newCartItem = {
              productId: product.id,
              productVariationId: -1,
              name: product.name,
              quantity: 1,
              price: Number(product.price),
              imageSrc: product.images?.[0]?.src || null,
              imageAlt: product.images?.[0]?.alt || null,
              attributes: [],
            };
            setCartValues((prevValue) => [...prevValue, newCartItem]);
            showSuccessCartToast();
          } else {
            toast.error(`Товара с названием ${product.name} нет в наличии`);
          }
        }
        return;
      } else {
        toast.error("Такая вариация не доступна");
        return;
      }
    }

    // Handle adding a variable product to the cart
    const productVariationFromCart = cartValues.find(
        (cv) => cv.productVariationId === selectedProductVariation.id
    );
    const stockQuantity = selectedProductVariation.stock_quantity || 0;

    if (productVariationFromCart)
    {
      const newQuantity = productVariationFromCart.quantity + 1;

      if (newQuantity <= stockQuantity) {
        setCartValues((prevValue) =>
            prevValue.map((item) =>
                item.productVariationId === selectedProductVariation.id
                    ? {...item, quantity: newQuantity}
                    : item
            )
        );
        showSuccessCartToast();
      } else {
        toast.error(
            `Товара с названием ${product.name} и аттрибутами ${productVariationFromCart.attributes.join(", ")} в наличии только ${
                selectedProductVariation.stock_quantity || 0
            }`
        );
      }
    } else {
      if (stockQuantity > 0) {
        const newCartItem = {
          productId: product.id,
          productVariationId: selectedProductVariation.id,
          name: product.name,
          quantity: 1,
          price: Number(selectedProductVariation.price),
          imageSrc: selectedProductVariation.image?.src || null,
          imageAlt: selectedProductVariation.image?.alt || null,
          attributes: Object.keys(formValues).map((attributeId) => {
            const attributeName = product.attributes.find((a) => a.id === Number(attributeId))?.name;
            const attributeVariation = formValues[attributeId]?.name;
            return `${attributeName} ${attributeVariation}`;
          }),
        };
        setCartValues((prevValue) => [...prevValue, newCartItem]);
        showSuccessCartToast();
      }
      else {
        toast.error(
            `Товара с названием ${product.name} нет в наличии`
        );
      }
    }
  }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {isOutOfStock && <p className="text-xl text-gray-900">Товара нет в наличии</p>}

          {[...product.attributes].reverse().map((a) => {
            return (
                <div key={a.id} className="mt-6">
                  <AttributeAutoComplete
                      label={a.name}
                      attribute={a}
                      value={form.values[a.id]}
                      productVariations={productVariations}
                      onChange={(value) => {
                        form.setFieldValue(String(a.id), value);
                      }}
                      form={form}
                  />
                </div>
            );
          })}

          <Button type="submit" className="mt-8" color="dark" disabled={isAddToCartButtonDisabled} fullSized>
            Добавить в корзину
          </Button>
        </form>
    );
  }