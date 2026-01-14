"use client";



import { useEffect, useState } from "react";
import ClientOnly from "@/components/client_only";

import CountryCombobox from "@/components/ui/country-combobox";
import CityCombobox from "@/components/ui/city-combobox";
import RegionCombobox from "@/components/ui/region-combobox";
import PostCodeCombobox from "@/components/ui/postcode-combobox";


export default function CDEKAdress({
    onAddressSelect,
    onAddressValidChange,
    storedAddress,
}: {
    onAddressSelect: (address: any) => void,
    onAddressValidChange?: (isValid: boolean) => void,
    storedAddress: any,
}) {



    const [selectedCountry, setSelectedCountry]
        = useState<{ code: string; name: string } | null>(storedAddress.country ?? { 'code': 'KZ', 'name': 'Казахстан' })
    const [selectedCity, setSelectedCity]
        = useState<{ code: string; name: string } | null>(storedAddress.city ?? null)
    const [selectedRegion, setSelectedRegion]
        = useState<{ code: string; name: string } | null>(storedAddress.region ?? null)
    const [selectedPostCode, setSelectedPostCode] = useState(storedAddress.postcode ?? '')
    const [street, setStreet] = useState(storedAddress.street ?? '');
    const [streetEnter, setStreetEnter] = useState(false);
    const [streetError, setStreetError] = useState(false);

    const handleCountryChange = (value: { code: string; name: string } | null) => {
        setSelectedCountry(value);
        // Сброс дочерних полей при изменении страны
        setSelectedRegion(null);
        setSelectedCity(null);
        setSelectedPostCode('');
    };

    const handleRegionChange = (value: { code: string; name: string } | null) => {
        setSelectedRegion(value);
        // Сброс дочерних полей при изменении региона
        setSelectedCity(null);
        setSelectedPostCode('');
    };

    const handleCityChange = (value: { code: string; name: string } | null) => {
        setSelectedCity(value);
        // Сброс посткода при изменении города
        setSelectedPostCode('');
    };

    const handleBlurStreet = (event: React.FocusEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setStreet(newValue);
        setStreetError(newValue.trim() === '');
        setStreetEnter(true)
    };


    useEffect(() => {
        const isValid = selectedCountry !== null && selectedCity !== null && street.trim() !== '';
        if (onAddressValidChange) {
            onAddressValidChange(isValid);
        }
        
        if (streetEnter) {
            setStreetEnter(false)
            if (street.trim() !== '') {
                onAddressSelect({
                    country: selectedCountry,
                    region: selectedRegion,
                    city: selectedCity,
                    postcode: selectedPostCode,
                    street
                })
            }
        }
    }, [selectedCountry, selectedCity, selectedRegion, selectedPostCode, street, streetEnter, onAddressValidChange])



    return (
        <ClientOnly>

            <div className="flex flex-wrap">
                <CountryCombobox
                    className="w-1/2 md:w-1/3 p-2"
                    value={selectedCountry?.code || ''}
                    onChange={handleCountryChange}
                />
                <RegionCombobox
                    className="w-1/2 md:w-1/3 p-2"
                    country={selectedCountry?.code || ''}
                    value={selectedRegion?.code || ''}
                    onChange={handleRegionChange}
                />
                <CityCombobox
                    className="w-1/2 md:w-1/3 p-2"
                    country={selectedCountry?.code || ''}
                    region={selectedRegion?.code || ''}
                    value={selectedCity?.code || ''}
                    onChange={handleCityChange}
                />
                <PostCodeCombobox
                    className="w-1/2 md:w-1/3 p-2"
                    city_code={selectedCity?.code || ''}
                    value={selectedPostCode}
                    onChange={setSelectedPostCode}
                />

                <div className="w-1/1 md:w-2/3 p-2">

                        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        Адрес
                        <input
                            value={street}
                            onBlur={handleBlurStreet}
                            onChange={(e) => {
                                setStreet(e.target.value);
                                if (e.target.value.trim() !== '') {
                                    setStreetError(false);
                                }
                            }}
                            type="text"
                            required
                            className={`w-full rounded-md border px-2 py-1 mt-2 focus:border-black focus:outline-none ${streetError ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        {streetError && <span className="text-red-500 text-sm">Обязательное поле</span>}
                    </label>


                </div>
            </div>
        </ClientOnly>
    );
}
