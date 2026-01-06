'use server'
import { transporter } from "@/libs/mail";

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

