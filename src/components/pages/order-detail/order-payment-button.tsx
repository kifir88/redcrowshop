"use client"

import { useState } from "react";
import { Button } from "flowbite-react";
import { Order } from "@/types/woo-commerce/order";
import { PayGoGeneratePaymentURL } from "@/libs/paygo_gate";

export default function OrderPaymentButton({ order, disabled }: { order: Order; disabled: boolean }) {



  const hadleStartPayment = () => {

    PayGoGeneratePaymentURL(order)
      .then(url => window.location.assign(url))
      .catch(err => console.error("Error generating PspHost payment URL:", err));

  }


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