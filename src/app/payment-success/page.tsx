import { fetchOrder } from "@/libs/woocommerce-rest-api";
import { formatPriceToKZT } from "@/libs/helper-functions";
import { Order } from "@/types/woo-commerce/order";
import config from "@/config";

export default async function PaymentSuccessPage({
                                                     searchParams,
                                                 }: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const pageId =
        config.PAGES && config.PAGES["payment_success"]
            ? config.PAGES["payment_success"]
            : 0;

    const {InvId, order_token} = await searchParams;

    const [strapiPaymentPageData, orderData] = await Promise.all([
        fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts/${pageId}?v=${new Date().getTime()}`,
            {
                method: "GET",
                headers: {
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        ),
        fetchOrder(InvId ?? "", order_token ?? ""),
    ]);

    const txt = await strapiPaymentPageData.json();

    const parsedStrapiPage = txt.content.rendered.replace(
        "[[ORDER_ID]]",
        InvId ?? ""
    ).replace(
        "[[ORDER_DETAILS]]",
        generateOrderText(orderData?.data)
    );

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            Успешная оплата заказа #{orderData?.data.number ?? ""}
                        </h2>
                    </div>

                    <div className="mt-10 prose w-full max-w-none lg:prose-xl">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: parsedStrapiPage,
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function generateOrderText(order?: Order): string {
    if (!order) return "";

    const { billing, shipping, line_items, total } = order;

    return `
<br>
Детали оплаты:<br>
Имя: ${billing.first_name} ${billing.last_name}<br>
Электронная почта: ${billing.email}<br>
Телефон: ${billing.phone}<br>
<br>
Адрес для выставления счета:<br>
${billing.address_1}<br>
${billing.address_2 ? billing.address_2 + "<br>" : ""}${billing.city}, ${billing.state} ${billing.postcode}<br>
${billing.country}<br>
<br>
Адрес доставки:<br>
${shipping.address_1}<br>
${shipping.address_2 ? shipping.address_2 + "<br>" : ""}${shipping.city}, ${shipping.state} ${shipping.postcode}<br>
${shipping.country}<br>
<br>
Состав заказа:<br>
${line_items
        .map(
            (item) =>
                `${item.name} - Количество: ${item.quantity} - Цена: ${formatPriceToKZT(
                    item.price
                )}`
        )
        .join("<br>")}
<br>
<br>
Итого:<br>
${formatPriceToKZT(total)}
  `.trim();
}
