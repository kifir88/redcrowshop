'use server'
import { formatPriceToKZT } from "@/libs/helper-functions";
import { transporter } from "@/libs/mail";
import { Order } from "@/types/woo-commerce/order";

export async function sendEmail(to: string, subject: string, text: string) {
    try {

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
            to, subject, text
        });

        // Возвращаем успех
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error("Email error:", error);
        // Возвращаем ошибку (важно не "выбрасывать" её через throw, если хотите обработать в UI)
        return { success: false, error: "Ошибка при отправке почты" };
    }
}

    function generateOrderCreatedEmailText(order: Order): string {
        const { billing, shipping, line_items, total } = order;

        return `
    Ваш заказ создан и ожидает оплату!
    
    Детали оплаты:
    Имя: ${billing.first_name} ${billing.last_name}
    Электронная почта: ${billing.email}
    Телефон: ${billing.phone}
    
    Адрес для выставления счета:
    ${billing.address_1}
    ${billing.address_2 ? billing.address_2 + '\n' : ''}${billing.city}, ${billing.state} ${billing.postcode}
    ${billing.country}
    
    Адрес доставки:
    ${shipping.address_1}
    ${shipping.address_2 ? shipping.address_2 + '\n' : ''}${shipping.city}, ${shipping.state} ${shipping.postcode}
    ${shipping.country}
    
    Состав заказа:
    ${line_items
                .map(
                    (item) =>
                        `${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToKZT(item.price)}`
                )
                .join('\n')}
    
    Итого:
    ${formatPriceToKZT(total)}
      `.trim();
    }
