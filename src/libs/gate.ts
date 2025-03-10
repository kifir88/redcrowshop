import crypto from 'crypto';
import {Order} from "@/types/woo-commerce/order";
import {fetchCurrencyRates} from "@/libs/woocommerce-rest-api";

interface PaymentObject {
    [key: string]: any;
}

const PROJECT_ID = "147386";
const PROJECT_SECRET = "f96406756f8c31e914476d5b4b29cc7a311f0fc1db198979c9150cdfc9d22708d45f6bb8cbfe9a934f7756dd0ccb583879d2bb58f1cce374256b49fd0c3629c6";

const ignoredParams = ['frame_mode'];

const reducer = (obj: PaymentObject, prefix = '', ignored: string[] = []): string => {
    const ordered: PaymentObject = {};

    Object.keys(obj).sort().forEach((key) => {
        if (!ignored.includes(key)) {
            ordered[key] = obj[key];
        }
    });

    const str= Object.entries(ordered).reduce((acc, [prop, value]) => {
        if (value === null) value = '';
        if (typeof value === 'object') {
            return acc + reducer(value, prefix ? `${prefix}:${prop}` : prop, ignored);
        }
        if (typeof value === 'boolean') value = value ? 1 : 0;
        return acc + (prefix ? `${prefix}:${prop}:${value};` : `${prop}:${value};`);
    }, '');

    return str;
};

export const generateSignature = (obj: PaymentObject, salt: string): string => {
    const hmac = crypto.createHmac('sha512', salt);

    var str = reducer(obj, '', ignoredParams);
    str =  str.endsWith(";") ? str.slice(0, -1) : str;
    hmac.update(str);
    return hmac.digest('base64')
};

export class Callback {
    private secret: string;
    private callback: PaymentObject;
    private signature?: string;

    constructor(data: string | PaymentObject) {
        const obj = typeof data === 'string' ? JSON.parse(data) : { ...data };
        this.secret = PROJECT_SECRET;
        this.callback = obj;
        this.removeSignature(this.callback);

        if (!this.isValid()) {
            console.log("NOT VALID PAYMENT: "+ data);
        }
    }

    private removeSignature(obj: PaymentObject): void {
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
    private params: PaymentObject;

    constructor(projectId: string, salt: string, obj: PaymentObject = {}, url = 'https://paymentpage.paygo.kz') {

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
    public setParams(obj: PaymentObject): void {
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


export const convertKZTtoRUB = async (amountKZT: number): Promise<number> => {
    try {
        const response = await fetchCurrencyRates(); // Fetch the currency rates
        const rates = response.data; // Extract rates from the response

        console.log(response.data);

        const exchangeRate = parseFloat(rates.RUB) / parseFloat(rates.KZT); // Conversion rate from KZT to RUB

        console.log(exchangeRate);

        return parseFloat((amountKZT * exchangeRate).toFixed(2)); // Convert and round to 2 decimal places
    } catch (error) {
        console.error("Error fetching currency rates:", error);
        throw new Error("Failed to convert currency");
    }
};

export const pspHostGeneratePaymentURL = async (order: Order): Promise<string> => {

    const payment = new Payment(PROJECT_ID, PROJECT_SECRET);

    //var amountRUB = await convertKZTtoRUB(+order.total);

    payment.setParam('paymentAmount', order.total + "00");
    payment.setParam('paymentId', order.id);
    payment.setParam('customerId', 1);
    payment.setParam('paymentCurrency', 'KZT');
    payment.setParam('redirect_success_url', 'https://redcrow.kz/payment-success-psp?InvId='+order.id);
    payment.setParam('merchant_callback_url', 'https://redcrow.kz/api/order-result-psp')

    // set another parameters, like success or fail callback URL, customer details, etc.

    // get payment URL
    const url = payment.getUrl();

    console.log(url);


    return url;

}
