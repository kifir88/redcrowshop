"use client"

import {Dialog, Transition} from "@headlessui/react";
import React, {useState} from "react";
import {Button, Radio, Label} from "flowbite-react";
import {Order} from "@/types/woo-commerce/order";
import {robokassaGeneratePaymentURL} from "@/libs/robokassa-rest-api";
import useYookassaCreatePayment from "@/hooks/yookassa/useYookassaCreatePayment";
import toast from "react-hot-toast";
import {pspHostGeneratePaymentURL} from "@/libs/gate";

type Payment =
  | 'uKassa'
  | 'RoboKassa'
  | 'PspHost'
  | null

export default function OrderPaymentDialog({
  order,
  isOpen,
  onClose,
}: {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedOption, setSelectedOption] = useState<Payment>(null);

  const yookassaCreatePaymentMutation = useYookassaCreatePayment()

  const handleConfirmClick = () => {
    if (selectedOption === "RoboKassa") {
      const robokassaPaymentURL = robokassaGeneratePaymentURL(order);
      window.location.assign(robokassaPaymentURL)
    }

    if(selectedOption == 'PspHost')
    {
        const pspHostPaymentURL = pspHostGeneratePaymentURL(order)
            .then(url => window.location.assign(url))
            .catch(err => console.error("Error generating PspHost payment URL:", err));
    }

    if (selectedOption === "uKassa") {
      yookassaCreatePaymentMutation.mutate({
        order: order,
      }, {
        onError: () => {
          toast.error("Ошибка оплаты с помощю YooMoney. Попробуйте позже.")
        },
        onSuccess: (res) => {
          const confirmationUrl = res.data.payment.confirmation.confirmation_url;
          window.location.assign(confirmationUrl);
        }
      })
    }

  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mb-5 text-lg font-medium leading-6 text-gray-900"
                  >
                    Оплата заказа
                  </Dialog.Title>
                  <Dialog.Panel>
                    <fieldset className="flex max-w-md flex-col gap-4">
                      <legend className="mb-4">
                        Выберите способ оплаты
                      </legend>
                      {/*<div className="flex items-center gap-2">*/}
                      {/*  <Radio*/}
                      {/*    id="uKassa"*/}
                      {/*    name="paymentOption"*/}
                      {/*    value="uKassa"*/}
                      {/*    checked={selectedOption === "uKassa"}*/}
                      {/*    onChange={() => setSelectedOption("uKassa")}*/}
                      {/*  />*/}
                      {/*  <Label htmlFor="uKassa">*/}
                      {/*    uKassa*/}
                      {/*  </Label>*/}
                      {/*</div>*/}
                      {/*<div className="flex items-center gap-2">
                        <Radio
                            id="RoboKassa"
                            name="paymentOption"
                            value="RoboKassa"
                            checked={selectedOption === "RoboKassa"}
                            onChange={() => setSelectedOption("RoboKassa")}
                        />
                        <Label htmlFor="RoboKassa">
                          RoboKassa
                        </Label>
                      </div>*/}
                      <div className="flex items-center gap-2">
                        <Radio
                            id="PspHost"
                            name="paymentOption"
                            value="PspHost"
                            checked={selectedOption === "PspHost"}
                            onChange={() => setSelectedOption("PspHost")}
                        />
                        <Label htmlFor="PspHost">
                          PspHost
                        </Label>
                      </div>
                    </fieldset>

                    <div className="mt-10">
                      <Button
                          color="dark"
                          fullSized
                          disabled={!selectedOption}
                          isProcessing={yookassaCreatePaymentMutation.isPending}
                          onClick={handleConfirmClick}
                      >
                        Подтвердить
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}