"use client"

import { useState, useTransition } from "react";
import { Button } from "flowbite-react";
import { Order } from "@/types/woo-commerce/order";
import getPaymentUrl from "@/app/actions/paygo";
import toast from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import { amountCurrency, CurrencyType } from "@/libs/currency-helper";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";

export default function OrderPaymentButton({ order, disabled, currencyRates }: { order: Order; disabled: boolean, currencyRates: CustomCurrencyRates }) {

  const [storedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");

  const [isPending, startTransition] = useTransition();

  const hadleStartPayment = async () => {

    const token = order.meta_data.find((meta: { key: string; }) => meta.key === "order_token")?.value ?? '';
    //PayGo принимает центы как десятки.
    const total = Math.round(amountCurrency(parseInt(order.total), storedCurrency, currencyRates) * 100)
    //Заказы хранятся в тенге, конвертируем для платежа в выбранной валюте
    const payload = {
      total: total,
      currency: storedCurrency,
      id: order.id,
      token,
      customer_id: order.customer_id,
    }

    startTransition(async () => {
      try {
        const result = await getPaymentUrl(payload);
        if (result.url) window.location.assign(result.url)
      } catch (error) {
        toast.error('Ошибка платежной системы #UN-318')
      }
    });

  }


  return (
    <>
      {!order.date_paid && (
        <Button
          color="dark"
          onClick={hadleStartPayment}
          disabled={disabled || order.status !== 'pending' || isPending}
          fullSized
        >
          {isPending ? 'Загрузка...' : 'Оплатить'}
        </Button>
      )}

    </>
  )
}