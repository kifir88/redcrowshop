"use client";

import {Order} from "@/types/woo-commerce/order";
import {formatPriceToKZT} from "@/libs/helper-functions";
import {Button} from "flowbite-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import 'dayjs/locale/ru';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ru');

export default function OrderRowItem({order, handleOpenPaymentModal}: {order: Order, handleOpenPaymentModal: () => void}) {
  const formattedCreatedDate = dayjs
    .utc(order.date_created)
    .local()
    .format("DD MMMM YYYY");

  return (
    <div className="flex flex-wrap items-center gap-y-4 py-6">
      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">ID:</dt>
        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
          <a href="#" className="hover:underline">#{order.id}</a>
        </dd>
      </dl>

      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Дата создания:</dt>
        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
          {formattedCreatedDate}
        </dd>
      </dl>

      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Сумма:</dt>
        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
          {formatPriceToKZT(Number(order.total))}
        </dd>
      </dl>

      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
        <dd
          className="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"
        >
          {order.status}
        </dd>
      </dl>

      <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
        {!order.date_paid && (
          <Button color="dark" onClick={handleOpenPaymentModal}>
            Оплатить
          </Button>
        )}
        <Button color="light">
          Детальнее
        </Button>
      </div>
    </div>
  )
}