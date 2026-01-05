"use client"; // Делаем компонент клиентским

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import OrderPaymentButton from "@/components/pages/order-detail/order-payment-button";
import { Badge } from "flowbite-react";
import Image from "next/image";
import { Order } from "@/types/woo-commerce/order"; // Импортируем тип
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {formatPriceToKZT, formatPriceToLocale} from "@/libs/helper-functions";

interface OrderDetailClientProps {
    orderData: Order;
    currencyRates: CustomCurrencyRates;
}

export default function OrderDetailClient({ orderData, currencyRates }: OrderDetailClientProps) {
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("KZT");
    const [storedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");

    useEffect(() => {
        if (storedCurrency) {
            setSelectedCurrency(storedCurrency);
        }
    }, [storedCurrency]);


    let items_total = 0;

    orderData.line_items.map(item=>{
        items_total+=parseInt(item.total)
    })
    console.log(orderData)

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            Заказ {orderData?.number}
                        </h2>

                        {!!orderData.date_paid_gmt && (
                            <Badge size="lg" color="green">Заказ оплачен</Badge>
                        )}
                    </div>

                    <div className="mt-6 space-y-4 border-b border-t border-gray-200 py-8 dark:border-gray-700 sm:mt-8">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Информация об оплате и доставке
                        </h4>

                        <dl>
                            <dt className="text-base font-medium text-gray-900 dark:text-white">Данные о покупателе</dt>
                            <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                                {Object.values(orderData?.billing).filter(Boolean).join(", ")}
                            </dd>
                        </dl>

                        <dl>
                            <dt className="text-base font-medium text-gray-900 dark:text-white">Данные доставки</dt>
                            <dd className="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">
                                {Object.values(orderData?.shipping).filter(Boolean).join(", ")}
                            </dd>
                        </dl>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <div className="relative overflow-x-auto border-b border-gray-200 dark:border-gray-800">
                            <table className="w-full text-left font-medium text-gray-900 dark:text-white md:table-fixed">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {orderData?.line_items.map((li) => (
                                    <tr key={li.id}>
                                        <td className="whitespace-nowrap py-4 md:w-[384px]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center aspect-square w-10 h-10 shrink-0">
                                                    <Image
                                                        className="h-auto w-full max-h-full dark:hidden object-cover"
                                                        src={li.image.src}
                                                        alt="altimage"
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className="hover:underline">{li.name}</div>
                                            </div>
                                        </td>

                                        <td className="p-4 text-base font-normal text-gray-900 dark:text-white" style={{textAlign:"right"}}>
                                            {`x${li.quantity}`}
                                        </td>

                                        <td className="p-4 text-right text-base font-bold text-gray-900 dark:text-white">
                                            {formatPriceToLocale(Number(li.total), selectedCurrency)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 space-y-6">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Платеж</h4>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">Стоимость товаров</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                                            {formatPriceToLocale(Number(items_total), selectedCurrency)}
                                        </dd>
                                    </dl>

                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">Скидка</dt>
                                        <dd className="text-base font-medium text-green-500">
                                            {`- ${formatPriceToLocale(Number(orderData?.discount_total), selectedCurrency)}`}
                                        </dd>
                                    </dl>

                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">Доставка</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                                            {formatPriceToLocale(Number(orderData?.shipping_total), selectedCurrency)}
                                        </dd>
                                    </dl>

                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-gray-500 dark:text-gray-400">Налоги</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                                            {formatPriceToLocale(Number(orderData?.total_tax), selectedCurrency)}
                                        </dd>
                                    </dl>
                                </div>

                                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                    <dt className="text-lg font-bold text-gray-900 dark:text-white">Конечная цена</dt>
                                    <dd className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatPriceToLocale(Number(orderData?.total), selectedCurrency)}
                                    </dd>
                                </dl>
                            </div>

                            <OrderPaymentButton order={orderData} disabled={!orderData?.total} />
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}
