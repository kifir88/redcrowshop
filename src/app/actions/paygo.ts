
'use server'

import { createOrderPayload, PayGoGeneratePaymentURL } from "@/libs/paygo_gate";



export default async function getPaymentUrl(payload: createOrderPayload) {


    try {
        const result = await PayGoGeneratePaymentURL(payload);
        return { error: false, url: result }
    } catch (err) {
        console.error("Error generating PspHost payment URL:", err)
        return {error:true, message:'Ошибка платежной системы #FD-714'}
    }

}