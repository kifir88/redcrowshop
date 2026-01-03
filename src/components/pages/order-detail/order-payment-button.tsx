"use client"

import {useState} from "react";
import {Button} from "flowbite-react";
import OrderPaymentDialog from "@/components/pages/orders/order-payment-dialog";
import {Order} from "@/types/woo-commerce/order";
import { pspHostGeneratePaymentURL } from "@/libs/paygo_gate";

export default function OrderPaymentButton({order, disabled}: {order: Order; disabled: boolean}) {
  const [isPaymentModalOpened, setIsPaymentModalOpened] = useState(false);

// Currently we have one payment method, rework if need more
const hadleStartPayment = () => {

      pspHostGeneratePaymentURL(order)
        .then(url => window.location.assign(url))
        .catch(err => console.error("Error generating PspHost payment URL:", err));
    
  }

  // const handleOpenPaymentModal = () => {
  //   setIsPaymentModalOpened(true);
  // }
  // const handleClosePaymentModal = () => {
  //   setIsPaymentModalOpened(false);
  // }

  return (
    <>
      {!order.date_paid && (
        <Button
          color="dark"
          onClick={hadleStartPayment}
          disabled={disabled || order.status !== 'pending'}
          fullSized
        >
          Оплатить
        </Button>
      )}

      {/* <OrderPaymentDialog
        isOpen={isPaymentModalOpened}
        order={order}
        onClose={handleClosePaymentModal}
      /> */}
    </>
  )
}