'use server'
import { formatPriceToLocale } from "@/libs/helper-functions";
import { transporter } from "@/libs/mail";
import { Order } from "@/types/woo-commerce/order";

export async function sendEmail(to: string, subject: string, text: string) {
    try {

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
            to, subject, text, html: text
        });

        // Возвращаем успех
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error("Email error:", error);
        // Возвращаем ошибку (важно не "выбрасывать" её через throw, если хотите обработать в UI)
        return { success: false, error: "Ошибка при отправке почты" };
    }
}

export async function orderEmail(order: any, res: any) {
    console.log(res);
    const text = generateOrderCreatedEmailText(order, res);
    await sendEmail(order.billing.email, `Ваш заказ #${res.id} создан и ожидает оплату!`, text)
}

function generateOrderCreatedEmailText(order: any, res: any): string {
    const { billing, shipping, line_items } = order;

    const url = `${process.env.BASE_URL}/orders/${res.id}?order_token=${order.order_token}`;


    const htmlEmail = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #f8f8f8; padding: 20px; border-bottom: 1px solid #e0e0e0;">
        <h2 style="margin: 0; color: #2c3e50;">Заказ успешно создан!</h2>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Номер заказа: <strong>#${res.id}</strong></p>
    </div>

    <div style="padding: 20px;">
        <p style="font-size: 16px;">Здравствуйте, ваш заказ ожидает оплаты.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                    <h4 style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Детали оплаты</h4>
                    <p style="margin: 0; font-size: 14px;">
                        <strong>Имя:</strong> ${billing.first_name} ${billing.last_name}<br>
                        <strong>Email:</strong> ${billing.email}<br>
                        <strong>Тел:</strong> ${billing.phone}
                    </p>
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <h4 style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Адрес доставки</h4>
                    <p style="margin: 0; font-size: 14px;">
                        ${shipping.address_1}<br>
                        ${shipping.address_2 ? shipping.address_2 + '<br>' : ''}
                        ${shipping.city}, ${shipping.state} ${shipping.postcode}<br>
                        ${shipping.country}
                    </p>
                </td>
            </tr>
        </table>

        <h4 style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Состав заказа</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background-color: #fdfdfd; font-size: 14px; text-align: left;">
                    <th style="padding: 8px; border-bottom: 1px solid #eee;">Товар</th>
                    <th style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">Кол-во</th>
                    <th style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Цена</th>
                </tr>
            </thead>
            <tbody>
                ${line_items.map((item: any) => `
                    <tr style="font-size: 14px;">
                        <td style="padding: 8px; border-bottom: 1px solid #f9f9f9;">${item.name}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f9f9f9; text-align: center;">${item.quantity}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #f9f9f9; text-align: right;">${formatPriceToLocale(item.price, order.currency)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; text-align: right;">
            <p style="margin: 0; font-size: 14px;">Товары: <strong>${order.prices.items_total}</strong></p>
            <p style="margin: 5px 0; font-size: 14px;">Доставка: <strong>${order.prices.shipping_total}</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 18px; color: #e67e22;">Итого: <strong>${order.prices.total}</strong></p>
        </div>

        <a href="${url}">Перейти на страницу оплаты</a>
    </div>
    
    <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © 2026 RedCrow Store. Это письмо отправлено автоматически.
    </div>
</div>
`;
    return htmlEmail;
    //     return `
    //     Ваш заказ #${res.id} создан и ожидает оплату!

    //     Детали оплаты:
    //     Имя: ${billing.first_name} ${billing.last_name}
    //     Электронная почта: ${billing.email}
    //     Телефон: ${billing.phone}

    //     Адрес для выставления счета:
    //     ${billing.address_1}
    //     ${billing.address_2 ? billing.address_2 + '\n' : ''}${billing.city}, ${billing.state} ${billing.postcode}
    //     ${billing.country}

    //     Адрес доставки:
    //     ${shipping.address_1}
    //     ${shipping.address_2 ? shipping.address_2 + '\n' : ''}${shipping.city}, ${shipping.state} ${shipping.postcode}
    //     ${shipping.country}

    //     Состав заказа:
    // ${line_items
    //             .map(
    //                 (item: { name: any; quantity: any; price: number | String; }) =>
    //                     `       ${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToLocale(item.price, order.currency)}`
    //             )
    //             .join('\n')}

    //     Стоимость товаров:  ${order.prices.items_total}
    //     Стоимость доставки:  ${order.prices.shipping_total}
    //     Итого:  ${order.prices.total}


    //     <a href="${url}">Перейти на страницу оплаты</a>

    //       `.trim();
}
