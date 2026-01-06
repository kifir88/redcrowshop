"use client";


import { ClientData } from "@/types/client_data";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useEffect, useRef, useState } from "react";
import ClientOnly from "@/components/client_only";
import { useForm } from "@mantine/form";
import { Button, Radio, Label, Spinner } from "flowbite-react";
import axios from "axios";
import { CurrencyType, formatCurrency } from "@/libs/currency-helper";
import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";
import toast from "react-hot-toast";
import { DeliveryMethod, DeliveryOption } from "@/types/delivery";
import AddressMap, { AddressResult } from "@/components/ui/address-map";
import { LatLngExpression } from "leaflet";


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
        self: 'Самовывоз',
        cdek: 'CDEK'
    };


    const [storedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");

    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('self');
    const [tarifs, setTarifs] = useState<DeliveryOption[]>([]);
    const [selectedCode, setSelectedCode] = useState(null);

    const [isExpanded, setIsExpanded] = useState(true);

    const toggleCollapse = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (deliveryMethod == 'cdek') {
            let selectedOption: DeliveryOption | undefined = tarifs.find((item: any) => item.tariff_code == selectedCode)
            if (selectedOption !== undefined) {
                setShippingCost(deliveryMethod, selectedOption)
                setDeliveryValid(true)
            } else {
                setDeliveryValid(false)
            }
        } else if (deliveryMethod == 'self') {
            setSelectedCode(null)
            setShippingCost('self', null)
            setDeliveryValid(true)
        } else {
            setDeliveryValid(false)
        }
    }, [deliveryMethod, selectedCode])

    const [waitCDEK, setWaitCDEK] = useState<boolean>(false)

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
                    city: storedAddress?.address?.city,
                    country_code: storedAddress?.address?.country_code,
                    address: storedAddress.displayName,
                    region: storedAddress.address?.state,
                    postal_code: storedAddress.address?.postcode,
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
            const response = await axios.post("/api/cdek", reuqest_data);

            setTarifs(response.data.tariff_codes.filter((e: any) =>
                [3, 4].includes(e.delivery_mode)
                && e.tariff_code.toString().slice(0, 2) != '12'
                && e.tariff_code.toString().slice(0, 1) != '6'
            ))

        } catch (e: any) {
            let errors = e.response.data?.errors
            toast.error('Ошибка CDEK: ' + errors[0]?.message)
        }
        setWaitCDEK(false)
    };

    const [storedAddress, setAddress] = useLocalStorage('client_address', {} as AddressResult);

    let initialMapPos = [43.2220, 76.8512] as LatLngExpression;
    if (storedAddress?.lat && storedAddress?.lng)
        initialMapPos = [storedAddress.lat, storedAddress.lng] as LatLngExpression;

    const onAddressSelect = (address: any) => {
        setAddress(address)
    }

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

                        <fieldset className="flex max-w-md flex-col gap-4">
                            <legend className="mb-4">
                                Выберите способ доставки
                            </legend>


                            <div className="flex items-center gap-4 p-2">
                                {(Object.keys(deliveryMethods) as DeliveryMethod[]).map((key) => (
                                    <div key={key} >
                                        <Radio
                                            id={`delivery_${key}`}
                                            checked={deliveryMethod === key}
                                            onChange={() => setDeliveryMethod(key)}
                                        />
                                        <Label htmlFor={`delivery_${key}`} className="pl-2">
                                            {deliveryMethods[key]}
                                        </Label>
                                    </div>
                                ))}
                            </div>

                        </fieldset>

                        <div className="mt-2">

                        </div>
                        <div
                            className={`${deliveryMethod == 'cdek' ? '' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}
                        >

                            <AddressMap
                                onAddressSelect={onAddressSelect}
                                initialPosition={initialMapPos}
                            />
                            <Button

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
