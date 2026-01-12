import { fetchPage } from "@/libs/strapi-rest-api";
import { fetchOrder } from "@/libs/woocommerce-rest-api";
import { formatPriceToKZT } from "@/libs/helper-functions";
import ReactMarkdown from "react-markdown";
import config from "@/config"

export default async function PaymentErrorPage({
    searchParams
}: {
    searchParams: Promise<Record<string, string>>
}) {


    const { InvId, order_token } = await searchParams

    // Check if the environment variable is loaded and has the key
    const pageId = config.PAGES && config.PAGES['payment_error']
        ? config.PAGES['payment_error']
        : 0;


    const [
        strapiPaymentSuccessPageData,
        orderData,
    ] = await Promise.all([
        //fetchPage("payment-error"),
        fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts/${pageId}?v=${new Date().getTime()}`, {
            method: 'GET', // or 'POST'
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate', // Instructs the browser to not store the cache
                'Pragma': 'no-cache', // For HTTP/1.0 compatibility
                'Expires': '0' // Proxies and others
            }
        }),
        fetchOrder(InvId, order_token)
    ])

    const txt = await strapiPaymentSuccessPageData.json();

    const productList = orderData?.data.line_items
        .map(li => (`- ${li.name} / ${li.quantity} / ${formatPriceToKZT(li.total)}`))
        .join();

    const parsedStrapiPage = txt.content.rendered
        .replace("[[ORDER_ID]]", InvId)
        .replace("[[TOTAL_PRICE]]", formatPriceToKZT(orderData?.data?.total ?? 0))
        .replace("[[PRODUCT_LIST]]", productList);

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            Ошибка оплаты заказа #{orderData?.data.number}
                        </h2>
                    </div>

                    <div className="mt-10 prose w-full max-w-none lg:prose-xl">
                        <div dangerouslySetInnerHTML={{
                            __html: parsedStrapiPage
                        }}>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}