import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PhoneInput, { formatPhoneNumberIntl } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import CountryList from "country-list";
import ru from 'react-phone-number-input/locale/ru.json';
import 'react-phone-number-input/style.css';
import {useForm} from "@mantine/form";
import {cn} from "@/libs/utils";
import useCreateOrder from "@/hooks/order/useCreateOrder";
import {useLocalStorage} from "usehooks-ts";
import {CartItem} from "@/types/cart";
import toast from "react-hot-toast";
import {Button} from "flowbite-react";
import {useRouter} from "next/navigation";
import {fetchCurrencyRates, fetchProduct, fetchProductVariation, updateOrder} from "@/libs/woocommerce-rest-api";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {amountCurrency, CurrencyType} from "@/libs/currency-helper";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import {Order} from "@/types/woo-commerce/order";
import {formatPriceToKZT} from "@/libs/helper-functions";

interface ShippingDetailsDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  currencyRates: CustomCurrencyRates
  selectedCurrency: CurrencyType,
}

interface FormValues {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export default function ShippingDetailsDialog({
  currencyRates,
   selectedCurrency,
  isOpen,
  closeModal,
}: ShippingDetailsDialogProps) {
  const router = useRouter();
  const [cartItems, _, clearCartItems] = useLocalStorage<CartItem[]>("cartItems", [])

  const countryData = CountryList.getData();

  const createOrderMutation = useCreateOrder()

  // Generate a unique order token
  const orderToken = uuidv4();

  const form = useForm<FormValues>({
    initialValues: {
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      email: '',
      phone: '',
    },

    validate: {
      phone: value => !!value && isValidPhoneNumber(value)
        ? null
        : "Не валидный номер телефона",
    }
  })

    const validateCartItems = async (): Promise<{
        valid: boolean;
        updatedCart: CartItem[];
        invalidIds: number[];
    }> => {

        const updatedCart: CartItem[] = [];
        const invalidIds: number[] = [];

        for (const item of cartItems) {
            try {
                const productId =
                    item.productVariationId !== -1
                        ? item.productVariationId
                        : item.productId;

                let productData: any = null;

                console.log("validating item: " + productId);

                // Fetch product or variation
                if (item.productVariationId === -1) {
                    const res = await fetchProduct(item.productId);
                    productData = res.data;
                } else {
                    const res = await fetchProductVariation(
                        item.productId,
                        item.productVariationId
                    );
                    productData = res.data;
                }

                // ❌ Product deleted or unavailable
                if (
                    !productData ||
                    productData.status === "trash" ||
                    productData.stock_status === "outofstock"
                ) {
                    invalidIds.push(productId);
                    continue;
                }

                // Stock validation
                const hasStock =
                    !productData.manage_stock ||
                    productData.stock_quantity >= item.quantity;

                if (hasStock) {

                } else {
                    invalidIds.push(productId);
                }
            } catch {
                // Request failed — treat as invalid product
                invalidIds.push(item.productId);
                continue;
            }
        }

        // FINAL RESULT
        const valid = invalidIds.length === 0;

        return {
            valid,
            updatedCart,
            invalidIds,
        };
    };


    const calculatePrice = async () => {
    try {
      const response = await axios.post("/api/cdek", {
        //date: new Date().toISOString(),
        type: 1,
        from_location: {
          city: "Москва",
          country_code: "RU",
          postal_code: "101000"
        },
        to_location: {
          city: "Санкт-Петербург",
          country_code: "RU",
          postal_code: "190000"
        },
        packages: [
          {
            weight: 1000, // в граммах
            length: 10,   // в сантиметрах
            width: 10,
            height: 10
          }
        ]
      });
      console.log(response.data);
      //setError(null);
    } catch (err) {
      //setError("Ошибка расчёта стоимости");
      //setPrice(null);
    }
  };

   const handleSubmit = async  (formValues: FormValues) =>  {

      // ✅ validate cart stock before proceeding
      const { valid, updatedCart, invalidIds } = await validateCartItems();

      if (!valid) {
          closeModal();
          window.location.reload();
          return;
      }

    const address = {
      ...formValues,
      phone: formatPhoneNumberIntl(formValues.phone as string)
    }

    //calculatePrice();
    //return;

    const lineItems = cartItems.map(ci => (ci.productVariationId !== -1 ? {
      product_id: ci.productId,
      variation_id: ci.productVariationId,
      quantity: ci.quantity,
      price: Math.round(amountCurrency(ci.price, selectedCurrency, currencyRates))
    } : {
      product_id: ci.productId,
      quantity: ci.quantity,
      price: Math.round(amountCurrency(ci.price, selectedCurrency, currencyRates))
    }))

    const payload = {
      payment_method: "",
      payment_method_title: "",
      set_paid: false,
      billing: address,
      shipping: address,
      line_items: lineItems,
      shipping_lines: [],
      currency: selectedCurrency,
      meta_data: [
        {
          key: "order_token",
          value: orderToken
        }
      ],
      customer_note: ""
    }

    function generateOrderCreatedEmailText(order: Order): string {
      const { billing, shipping, line_items, total } = order;

      return `
Ваш заказ создан и ожидает оплату!

Детали оплаты:
Имя: ${billing.first_name} ${billing.last_name}
Электронная почта: ${billing.email}
Телефон: ${billing.phone}

Адрес для выставления счета:
${billing.address_1}
${billing.address_2 ? billing.address_2 + '\n' : ''}${billing.city}, ${billing.state} ${billing.postcode}
${billing.country}

Адрес доставки:
${shipping.address_1}
${shipping.address_2 ? shipping.address_2 + '\n' : ''}${shipping.city}, ${shipping.state} ${shipping.postcode}
${shipping.country}

Состав заказа:
${line_items
          .map(
              (item) =>
                  `${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToKZT(item.price)}`
          )
          .join('\n')}

Итого:
${formatPriceToKZT(total)}
  `.trim();
    }

    createOrderMutation.mutate(payload, {
      onError: (e) => {
        console.error(e, "create-order-error")
        toast.error(`${e.response?.data}`)
      },
      onSuccess: async (res) => {
        clearCartItems();

          const orderId = res.data.id;

          try {
              await axios.post('https://admin.redcrow.kz/wp-json/custom/v1/reduce-stock', { orderId });
          } catch (err) {
              console.error('Failed to reduce stock', err);
          }


        try {
          const emailContent = generateOrderCreatedEmailText(res.data ?? null);

          const emailPayload = {
            to: res.data.billing.email,
            subject: `REDCROW Заказ #${res.data.id} Создан!\n`,
            text: emailContent
          }
          axios.post(
              "/api/mailgun",
              emailPayload,
              {
                baseURL: process.env.NEXT_PUBLIC_BASE_URL,
                headers: {
                  "Content-type": "application/json"
                }
              }
          )
        } catch(e){

        }

        router.push(`/orders/${res.data.id}?order_token=${orderToken}`)
        toast.success("Заказ успешно создан")
      },
    })
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 top-20 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Детали доставки
                  </Dialog.Title>
                  <form
                    onSubmit={form.onSubmit(handleSubmit)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <label className="block">
                      Имя
                      <input
                        type="text"
                        required
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("first_name")}
                      />
                    </label>
                    <label className="block">
                      Фамилия
                      <input
                        type="text"
                        required
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("last_name")}
                      />
                    </label>
                    <label className="col-span-2 block">
                      Улица
                      <input
                        type="text"
                        required
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("address_1")}
                      />
                    </label>
                    <label className="col-span-2 block">
                      Дом/Квартира
                      <input
                        type="text"
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("address_2")}
                      />
                    </label>
                    <label className="block">
                      Страна
                      <select
                        required
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("country")}
                      >
                        <option value="">Выберите страну</option>

                        {countryData.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      Город
                      <input
                        type="text"
                        required
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("city")}
                      />
                    </label>
                    <label className="block">
                      Регион
                      <input
                        type="text"
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("state")}
                      />
                    </label>
                    <label className="block">
                      Посткод / Индекс
                      <input
                        type="text"
                        required
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("postcode")}
                      />
                    </label>
                    <label className="col-span-2 block">
                      Электронная почта
                      <input
                        type="email"
                        required
                        className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                        {...form.getInputProps("email")}
                      />
                    </label>
                    <label className="col-span-2 block">
                      Контактный телефон
                      <PhoneInput
                        labels={ru}
                        placeholder={'Введите номер телефона'}
                        defaultCountry="KZ"
                        international
                        className={cn(
                          `w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none`,
                          !!form.errors.phone && 'border-red-500'
                        )}
                        {...form.getInputProps("phone")}
                      />
                    </label>
                    <div className="col-span-2">
                      <Button
                        type="submit"
                        color="dark"
                        fullSized
                        isProcessing={createOrderMutation.isPending}
                      >
                        Создать заказ
                      </Button>

                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};