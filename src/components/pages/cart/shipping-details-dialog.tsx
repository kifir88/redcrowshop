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

interface ShippingDetailsDialogProps {
  isOpen: boolean;
  closeModal: () => void;
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
  isOpen,
  closeModal,
}: ShippingDetailsDialogProps) {
  const router = useRouter();
  const [cartItems, _, clearCartItems] = useLocalStorage<CartItem[]>("cartItems", [])

  const countryData = CountryList.getData();

  const createOrderMutation = useCreateOrder()

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

  const handleSubmit = (formValues: FormValues) => {
    const address = {
      ...formValues,
      phone: formatPhoneNumberIntl(formValues.phone as string)
    }

    const lineItems = cartItems.map(ci => ({
      product_id: ci.productId,
      variation_id: ci.productVariationId,
      quantity: ci.quantity,
    }))

    const payload = {
      payment_method: "",
      payment_method_title: "",
      set_paid: false,
      billing: address,
      shipping: address,
      line_items: lineItems,
      shipping_lines: [],
    }

    createOrderMutation.mutate(payload, {
      onError: (e) => {
        console.error(e, "create-order-error")
        toast.error(`${e.response?.data}`)
      },
      onSuccess: (res) => {
        clearCartItems()
        router.push(`/orders/${res.data.id}`)
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
                      Регион / Провинция
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