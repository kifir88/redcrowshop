import useCreateOrder from "@/hooks/order/useCreateOrder";
import { CartItem } from "@/types/cart";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from 'uuid';
import { fetchProduct, fetchProductVariation } from "./woocommerce-rest-api";
import { ClientData } from "@/types/client_data";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { amountCurrency, CurrencyType } from "./currency-helper";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import toast from "react-hot-toast";
import axios from "axios";
import { Order } from "@/types/woo-commerce/order";

import { formatPriceToKZT } from "./helper-functions";
import { useRouter } from "next/navigation";


export class Cart {
    #orderToken: any
    #createOrderMutation: any
    #cartItems!: CartItem[]
    #clearCartItems: any
    #storedCurrency!: CurrencyType
    #currencyRates!: CustomCurrencyRates
    #clientData: ClientData
    #router

    constructor(currencyRates: CustomCurrencyRates) {
        this.#router = useRouter()
        this.#currencyRates = currencyRates
        this.#createOrderMutation = useCreateOrder()
        this.#orderToken = uuidv4();

        [this.#cartItems, , this.#clearCartItems] = useLocalStorage<CartItem[]>("cartItems", [])
        this.#storedCurrency = useLocalStorage<CurrencyType>("currency", "KZT")[0];
        this.#clientData = useLocalStorage<ClientData>('client_data', {} as ClientData)[0];

    }


    handleSubmit = async (shippingLines: any[]) => {

        // ✅ validate cart stock before proceeding
        const { valid, updatedCart, invalidIds } = await this.#validateItems();

        if (!valid) {
            window.location.reload();
            return;
        }



        const address = {
            ...this.#clientData,
            phone: formatPhoneNumberIntl(this.#clientData.phone as string)
        }

        const lineItems = this.#cartItems.map((ci: any) => (ci.productVariationId !== -1 ? {
            product_id: ci.productId,
            variation_id: ci.productVariationId,
            quantity: ci.quantity,
            price: Math.round(amountCurrency(ci.price, this.#storedCurrency, this.#currencyRates))
        } : {
            product_id: ci.productId,
            quantity: ci.quantity,
            price: Math.round(amountCurrency(ci.price, this.#storedCurrency, this.#currencyRates))
        }))

        const payload = {
            payment_method: "",
            payment_method_title: "",
            set_paid: false,
            billing: address,
            shipping: address,
            line_items: lineItems,
            shipping_lines: shippingLines,
            currency: this.#storedCurrency,
            meta_data: [
                {
                    key: "order_token",
                    value: this.#orderToken
                }
            ],
            customer_note: ""
        }



        this.#createOrderMutation.mutate(payload, {
            onError: (e: any) => {
                console.error(e, "create-order-error")
                toast.error(`${e.response?.data}`)
            },
            onSuccess: async (res: any) => {
                this.#clearCartItems();

                const orderId = res.data.id;

                try {
                    await axios.post(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/custom/v1/reduce-stock`, { orderId });
                } catch (err) {
                    console.error('Failed to reduce stock', err);
                }

                if (false) {
                    try {
                        const emailContent = this.#generateOrderCreatedEmailText(res.data ?? null);

                        const emailPayload = {
                            to: res.data.billing.email,
                            subject: `REDCROW Заказ #${res.data.id} Создан!\n`,
                            text: emailContent
                        }
                        axios.post(
                            "/api/mailgun",
                            emailPayload,
                            {
                                baseURL: process.env.NEXT_PUBLIC_BASE_URL,
                                headers: {
                                    "Content-type": "application/json"
                                }
                            }
                        )
                    } catch (e) {

                    }
                }

                this.#router.push(`/orders/${res.data.id}?order_token=${this.#orderToken}`)
                toast.success("Заказ успешно создан")
            },
        })
    }


    #generateOrderCreatedEmailText(order: Order): string {
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

    #validateItems = async (): Promise<{
        valid: boolean;
        updatedCart: CartItem[];
        invalidIds: number[];
    }> => {

        const updatedCart: CartItem[] = [];
        const invalidIds: number[] = [];

        for (const item of this.#cartItems) {
            try {
                const productId =
                    item.productVariationId !== -1
                        ? item.productVariationId
                        : item.productId;

                let productData: any = null;

                console.log("validating item: " + productId);

                // Fetch product or variation
                if (item.productVariationId === -1) {
                    const res = await fetchProduct(item.productId);
                    productData = res.data;
                } else {
                    const res = await fetchProductVariation(
                        item.productId,
                        item.productVariationId
                    );
                    productData = res.data;
                }

                // ❌ Product deleted or unavailable
                if (
                    !productData ||
                    productData.status === "trash" ||
                    productData.stock_status === "outofstock"
                ) {
                    invalidIds.push(productId);
                    continue;
                }

                // Stock validation
                const hasStock =
                    !productData.manage_stock ||
                    productData.stock_quantity >= item.quantity;

                if (hasStock) {

                } else {
                    invalidIds.push(productId);
                }
            } catch {
                // Request failed — treat as invalid product
                invalidIds.push(item.productId);
                continue;
            }
        }

        // FINAL RESULT
        const valid = invalidIds.length === 0;

        return {
            valid,
            updatedCart,
            invalidIds,
        };
    };
}


