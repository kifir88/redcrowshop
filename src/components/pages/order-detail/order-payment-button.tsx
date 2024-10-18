"use client"

import {useState} from "react";
import {Button} from "flowbite-react";
import OrderPaymentDialog from "@/components/pages/orders/order-payment-dialog";
import {Order} from "@/types/woo-commerce/order";

export default function OrderPaymentButton({order, disabled}: {order: Order; disabled: boolean}) {
  const [isPaymentModalOpened, setIsPaymentModalOpened] = useState(false);

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpened(true);
  }
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpened(false);
  }

  return (
    <>
      {!order.date_paid && (
        <Button
          color="dark"
          onClick={handleOpenPaymentModal}
          disabled={disabled || order.status !== 'pending'}
          fullSized
        >
          Оплатить
        </Button>
      )}

      <OrderPaymentDialog
        isOpen={isPaymentModalOpened}
        order={order}
        onClose={handleClosePaymentModal}
      />
    </>
  )
}