"use client";



import { useLocalStorage } from "usehooks-ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ClientOnly from "@/components/client_only";

import { Button, Radio, Label, Spinner } from "flowbite-react";

import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import toast from "react-hot-toast";
import { DeliveryMethod, DeliveryOption } from "@/types/delivery";
import CDEKAdress from "@/components/address/cdek_address";
import { tariffList } from "@/app/actions/cdek";


export default function ShippingDialog({
    currencyRates,
    deliveryValid,
    setDeliveryValid,
    setShippingCost,
}: {
    currencyRates: CustomCurrencyRates;
    deliveryValid: boolean;
    setDeliveryValid: (state: boolean) => void;
    setShippingCost: (method: DeliveryMethod, option: DeliveryOption | null) => void;
}) {

    const deliveryMethods: Record<DeliveryMethod, string> = {
        self_storage: 'Самовывоз со склада',
        self_showroom: 'Самовывоз из шоурума',
        cdek: 'CDEK',
        dhl: 'DHL',
    };


    const [storedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");

    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('self_storage');
    const [tarifs, setTarifs] = useState<DeliveryOption[]>([]);
    const [selectedCode, setSelectedCode] = useState(null);

    const [isExpanded, setIsExpanded] = useState(true);

    const toggleCollapse = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {

        switch (deliveryMethod) {
            case 'self_showroom':
            case 'self_storage':
            case 'dhl':
                setShippingCost(deliveryMethod, null)
                setDeliveryValid(true)
                setSelectedCode(null)
                break;
            case 'cdek':
                let selectedOption: DeliveryOption | undefined = tarifs.find((item: any) => item.tariff_code == selectedCode)
                if (selectedOption !== undefined) {
                    setShippingCost(deliveryMethod, selectedOption)
                    setDeliveryValid(true)
                } else {
                    setDeliveryValid(false)
                }
                break;
            default:
                setDeliveryValid(false)
                setSelectedCode(null)
        }

    }, [deliveryMethod, selectedCode])

    const [waitCDEK, setWaitCDEK] = useState<boolean>(false)

    const [storedAddress, setAddress] = useLocalStorage('customer_address', {} as any);


    const onAddressSelect = (address: any) => {
        setAddress(address)
    }

    const calculatePrice = async () => {
        setWaitCDEK(true)
        setTarifs([])
        //При использовании курса валют CDEK
        const currencyCodes = {
            'RUB': 1,
            'KZT': 2,
            'USD': 3,
            'EUR': 4
        }
        try {
            let reuqest_data = {
                //date: new Date().toISOString(),
                type: 1,
                // currency: currencyCodes[storedCurrency],
                currency: 2,
                from_location: {
                    city: "Алматы",
                    country_code: "KZ",
                    postal_code: "041609",
                    address: 'Ракышева 3',
                },
                to_location: {
                    code: storedAddress.city.code,
                    country_code: storedAddress.country.code,
                    address: storedAddress.street,
                    postal_code: storedAddress.postcode,
                },
                packages: [
                    {
                        weight: 1500, // в граммах
                        length: 10,   // в сантиметрах
                        width: 15,
                        height: 10
                    }
                ]
            };

            const response = await tariffList(reuqest_data);
            if (response.success) {
                setTarifs(response.data.tariff_codes.filter((e: any) =>
                    [3, 4].includes(e.delivery_mode)
                    && e.tariff_code.toString().slice(0, 2) != '12'
                    && e.tariff_code.toString().slice(0, 1) != '6'
                ))
            } else {
                toast.error(response.error)
            }

        } catch (e: any) {
            console.log(e)
        }
        setWaitCDEK(false)
    };



    return (
        <ClientOnly>
            <div className="mt-4 relative rounded-lg border border-gray-200 bg-white p-4 pt-1 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6 md:pt-1">


                <div>
                    <button onClick={toggleCollapse} className="w-full flex justify-between items-center py-5 text-bold border-b border-slate-200">
                        <span>Доставка

                            <span className={`px-2 status-icon ${deliveryValid ? "valid" : "invalid"}`}>
                                {deliveryValid ? "✔" : "✖"}
                            </span>
                        </span>
                        <span id="icon-1" className={`text-slate-800 transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                            </svg>
                        </span>
                    </button>

                    <div id="content-1" className={`${isExpanded ? '' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}>

                        <fieldset className="flex flex-col gap-4">
                            <legend className="mb-4">
                                Выберите способ доставки
                            </legend>

                            <ul className="items-center w-full text-sm font-medium text-heading bg-neutral-primary-soft border border-default rounded-lg sm:flex">

                                {(Object.keys(deliveryMethods) as DeliveryMethod[]).map((key) => (
                                    <li key={key}
                                        className="w-full border-b border-default sm:border-b-0 sm:border-r">
                                        <div className="flex items-center ps-3">
                                            <Radio id={`delivery_${key}`} value="" name="list-radio" className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                                                checked={deliveryMethod === key}
                                                onChange={() => setDeliveryMethod(key)}
                                            />
                                            <label htmlFor={`delivery_${key}`} className="w-full py-3 select-none ms-2 text-sm font-medium text-heading"> {deliveryMethods[key]}</label>
                                        </div>
                                    </li>

                                ))}
                            </ul>
                        </fieldset>

                        <div
                            className={`${deliveryMethod == 'cdek' ? 'min-h-[1000px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}
                        >

                            {!selectedCode &&
                                <div className="bg-rose-200 my-2 p-4 rounded-md border border-solid border-red-600">
                                    <div className="text-red-700 text-md">Необходимо выбрать тариф</div>
                                    <ul className="text-sm text-red-600">
                                        <li>Укажите адрес</li>
                                        <li>Выберите тариф из списка</li>
                                    </ul>
                                </div>
                            }

                            <CDEKAdress
                                storedAddress={storedAddress}
                                onAddressSelect={onAddressSelect}
                            />

                            <Button
                                className="mt-4"
                                color="dark"
                                size="sm"
                                disabled={waitCDEK}
                                onClick={calculatePrice}
                            >
                                Рассчитать стоимость доставки CDEK
                            </Button>



                            {waitCDEK && <div className="flex w-full justify-center"><Spinner /></div>}

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th colSpan={4}>  Выберите тариф</th>
                                    </tr>
                                    <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                                        <th></th>
                                        <th>Название тарифа</th>
                                        <th>Стоимость</th>
                                        <th>Срок (мин/макс)</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {tarifs.map((item: any) => (
                                        <tr
                                            key={item.tariff_code}
                                            onClick={() => setSelectedCode(item.tariff_code)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: selectedCode === item.tariff_code ? '#e1f5fe' : 'transparent',
                                                borderBottom: '1px solid #eee'
                                            }}
                                        >
                                            <td>
                                                <input
                                                    type="radio"
                                                    name="tariff"
                                                    checked={selectedCode === item.tariff_code}
                                                    onChange={() => setSelectedCode(item.tariff_code)}
                                                />
                                            </td>
                                            <td>{item.tariff_name} <br />
                                                <span className="text-sm text-slate-400">{item.tariff_description}
                                                </span>
                                            </td>

                                            <td> {formatCurrency(item.delivery_sum, storedCurrency, currencyRates)}</td>
                                            <td>{item.calendar_min} — {item.calendar_max} дн.</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                        </div>


                    </div>
                </div>


            </div>
        </ClientOnly>
    );
}
