"use client"

import {useState} from "react";
import {Button} from "flowbite-react";
import OrderPaymentDialog from "@/components/pages/orders/order-payment-dialog";
import {Order} from "@/types/woo-commerce/order";

export default function OrderPaymentButton({order}: {order: Order}) {
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
        <Button color="dark" onClick={handleOpenPaymentModal} fullSized>
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