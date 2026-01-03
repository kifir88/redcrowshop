import crypto from 'crypto';
import { Order } from "@/types/woo-commerce/order";
import { fetchCurrencyRates } from "@/libs/woocommerce-rest-api";
import { CartItem } from "@/types/cart";
import { recordTraceEvents } from 'next/dist/trace';

const GATE_KEYS ={
    'main_gate': {
        'id':"148586",
        'secret':"8852c0ae0851e0d909bdcdead3defae7d9018a3e32e4dd904d3a871616d3e19e048e4f7cae25def7033b74fd84186299a81e40edb155eb0fce84b55788e9bd44"
    },
    'rub_gate': {
        'id':"147396",
        'secret':"0dbca7f5a15a7031feeaead7f208f1abd177f40422f653eed2001b3ad6a0f8886b68e7f25f8a189e0b9d7fb81c7a67fc2e84ca1944bd1a8d0c138e1daa8ab99a"
    },
}


const ignoredParams = ['frame_mode'];

const reducer = (obj: any, prefix = '', ignored: string[] = []): string => {
    const ordered: any = {};

    Object.keys(obj).sort().forEach((key) => {
        if (!ignored.includes(key)) {
            ordered[key] = obj[key];
        }
    });

    const str = Object.entries(ordered).reduce((acc, [prop, value]) => {
        if (value === null) value = '';
        if (typeof value === 'object') {
            return acc + reducer(value, prefix ? `${prefix}:${prop}` : prop, ignored);
        }
        if (typeof value === 'boolean') value = value ? 1 : 0;
        return acc + (prefix ? `${prefix}:${prop}:${value};` : `${prop}:${value};`);
    }, '');

    return str;
};

export const generateSignature = (obj: any, salt: string): string => {
    const hmac = crypto.createHmac('sha512', salt);

    var str = reducer(obj, '', ignoredParams);
    str = str.endsWith(";") ? str.slice(0, -1) : str;
    hmac.update(str);
    return hmac.digest('base64')
};

export class Callback {
    private secret: string;
    private callback: any;
    private signature?: string;

    constructor(data: any) {
        const {'secret':PROJECT_SECRET} = GATE_KEYS[ data.payment?.currency =='RUB'?'rub_gate':'main_gate'];

        this.secret = PROJECT_SECRET;
        this.callback = data;

        this.removeSignature(this.callback);

        if (!this.isValid()) {
            console.log("NOT VALID PAYMENT: " + data);
        }
    }

    private removeSignature(obj: any): void {

        if (!obj || typeof obj !== 'object') return;

        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'object') {
                this.removeSignature(obj[key]);
            }
            if (key === 'signature') {
                this.signature = obj.signature;
                delete obj.signature;
            }
        });
    }

    public isValid(): boolean {
        return generateSignature(this.callback, this.secret) === this.signature;
    }

    public isPaymentSuccess(): boolean {
        return this.callback.payment?.status === 'success';
    }

    public getPaymentId(): string | null {
        return this.callback.payment?.id || null;
    }
}
export class Payment {
    private salt: string;
    private baseURI: string;
    private params: any;

    constructor(projectId: string, salt: string, obj: any = {}, url = 'https://paymentpage.paygo.kz') {

        this.salt = salt;
        this.baseURI = url;
        this.params = {
            project_id: projectId,
            //interface_type: JSON.stringify({ id: 22 }),
        };

        this.setParams(obj);
    }

    /**
     * Set multiple parameters at once.
     * @param obj Object containing payment parameters
     */
    public setParams(obj: any): void {
        Object.entries(obj).forEach(([key, val]) => {
            this.setParam(key, val);
        });
    }

    /**
     * Set a single parameter.
     * @param key Parameter name
     * @param value Parameter value
     */
    public setParam(key: string, value: any): void {
        this.params[key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()] = value;
    }

    /**
     * GET query string
     */
    private getQueryString(): string {
        return Object.keys(this.params)
            .map((key) => `${key}=${encodeURIComponent(this.params[key])}`)
            .join('&');
    }

    /**
     * Get full URL
     */
    public getUrl(): string {
        const signature = generateSignature(this.params, this.salt);

        console.log(signature);
        return `${this.baseURI}/payment?${this.getQueryString()}&signature=${encodeURIComponent(signature)}`;
    }
}


/*export const convertKZTtoRUB = async (amountKZT: number): Promise<number> => {
    try {
        const response = await fetchCurrencyRates(); // Fetch the currency rates
        const rates = response.data; // Extract rates from the response

        //console.log(response.data);

        //const exchangeRate = parseFloat(rates.RUB) / parseFloat(rates.KZT); // Conversion rate from KZT to RUB

        //console.log(exchangeRate);

        return parseFloat((amountKZT * exchangeRate).toFixed(2)); // Convert and round to 2 decimal places
    } catch (error) {
        console.error("Error fetching currency rates:", error);
        throw new Error("Failed to convert currency");
    }
};*/

export const pspHostGeneratePaymentURL = async (order: Order): Promise<string> => {

    const {'id':PROJECT_ID,'secret':PROJECT_SECRET} = GATE_KEYS[ order.currency =='RUB'?'rub_gate':'main_gate'];

    const payment = new Payment(PROJECT_ID, PROJECT_SECRET);

    payment.setParam('paymentAmount', (Number(order.total) * 100).toString());
    payment.setParam('paymentId', order.id);
    payment.setParam('customerId', 1);
    payment.setParam('paymentCurrency', order.currency);

    //const urlll = 'https://f485-195-7-13-231.ngrok-free.app';
    const calback_url = process.env.NEXT_PUBLIC_BASE_URL;

    const tokenMeta = order.meta_data.find((meta) => meta.key === "order_token");

    payment.setParam('redirect_success_url', calback_url + '/payment-success-psp?InvId=' + order.id + '&order_token=' + tokenMeta?.value);
    payment.setParam('merchant_callback_url', calback_url + '/api/order-result-psp');

    return payment.getUrl();

}
