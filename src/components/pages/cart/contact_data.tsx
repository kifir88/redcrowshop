"use client";


import { ClientData } from "@/types/client_data";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useEffect, useRef, useState } from "react";
import CountryList from "country-list";
import ClientOnly from "@/components/client_only";
import { useForm } from "@mantine/form";
import { Button } from "flowbite-react";
import PhoneInput, { formatPhoneNumberIntl } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js/max';
import 'react-phone-number-input/style.css';
import ru from 'react-phone-number-input/locale/ru.json';
import { cn } from "@/libs/utils";


export default function ContactData({

}: {
    }) {

    const [clientData, setClientData] = useLocalStorage<ClientData>('client_data', {} as ClientData);

    const [isExpanded, setIsExpanded] = useState(true);

    const toggleCollapse = () => {
        setIsExpanded(!isExpanded);
    };

    const form = useForm<ClientData>({
        initialValues: clientData,

        validate: {
            phone: value => !!value && isValidPhoneNumber(value)
                ? null
                : "Не валидный номер телефона",
        }
    })

    const handleSubmit = (formValues: ClientData) => {
        setClientData(formValues)
        const address = {
            ...formValues,
            phone: formatPhoneNumberIntl(formValues.phone as string)
        }

        console.log(address)
        console.log(clientData)
    }

    return (
        <ClientOnly>
            <div className="mt-4 relative rounded-lg border border-gray-200 bg-white p-4 pt-1 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6 md:pt-1">

                <div>
                    <button onClick={toggleCollapse} className="w-full flex justify-between items-center py-5 text-bold border-b border-slate-200">
                        <span>Контакты</span>
                        <span id="icon-1" className={`text-slate-800 transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                            </svg>
                        </span>
                    </button>

                    <div id="content-1" className={`${isExpanded ? '' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-in-out`}>

                        <form
                            onSubmit={form.onSubmit(handleSubmit)}
                            className="grid grid-cols-2 gap-4"
                        >
                            <label className="block">
                                Имя
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                                    {...form.getInputProps("first_name")}
                                />
                            </label>
                            <label className="block">
                                Фамилия
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                                    {...form.getInputProps("last_name")}
                                />
                            </label>
                            <label className="col-span-2 block">
                                Электронная почта
                                <input
                                    type="email"
                                    required
                                    className="w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none"
                                    {...form.getInputProps("email")}
                                />
                            </label>
                            <label className="col-span-2 block">
                                Контактный телефон
                                <PhoneInput
                                    labels={ru}
                                    placeholder={'Введите номер телефона'}
                                    defaultCountry="KZ"
                                    international
                                    className={cn(
                                        `w-full rounded-md border px-2 py-1 focus:border-black focus:outline-none`,
                                        !!form.errors.phone && 'border-red-500'
                                    )}
                                    {...form.getInputProps("phone")}
                                />
                            </label>
                            <div className="col-span-2">
                                <Button
                                    type="submit"
                                    color="dark"
                                    fullSized
                                >
                                    Сохранить
                                </Button>

                            </div>
                        </form>
                    </div>
                </div>


            </div>
        </ClientOnly>
    );
}
