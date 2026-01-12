"use client";



import { useEffect, useState } from "react";
import ClientOnly from "@/components/client_only";

import CountryCombobox from "@/components/ui/country-combobox";
import CityCombobox from "@/components/ui/city-combobox";
import RegionCombobox from "@/components/ui/region-combobox";
import PostCodeCombobox from "@/components/ui/postcode-combobox";


export default function CDEKAdress({
    onAddressSelect,
    storedAddress,
}: {
    onAddressSelect: (address: any) => void,
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

    const handleBlurStreet = (event: React.FocusEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setStreet(newValue);
        setStreetEnter(true)
    };


    useEffect(() => {
        if (streetEnter) {
            onAddressSelect({});
            setStreetEnter(false)
            onAddressSelect({
                country: selectedCountry,
                region: selectedRegion,
                city: selectedCity,
                postcode: selectedPostCode,
                street
            })
        }
    }, [selectedCountry, selectedCity, selectedRegion, selectedPostCode, streetEnter])



    return (
        <ClientOnly>

            <div className="flex flex-wrap">
                <CountryCombobox
                    className="w-1/2 md:w-1/3 p-2"
                    value={selectedCountry?.code || ''}
                    onChange={setSelectedCountry}
                />
                <RegionCombobox
                    className="w-1/2 md:w-1/3 p-2"
                    country={selectedCountry?.code || ''}
                    value={selectedRegion?.code || ''}
                    onChange={setSelectedRegion}
                />
                <CityCombobox
                    className="w-1/2 md:w-1/3 p-2"
                    country={selectedCountry?.code || ''}
                    region={selectedRegion?.code || ''}
                    value={selectedCity?.code || ''}
                    onChange={setSelectedCity}
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
                            onChange={(e) => setStreet(e.target.value)}
                            type="text"
                            required
                            className="w-full rounded-md border px-2 py-1 mt-2 focus:border-black focus:outline-none"

                        />
                    </label>


                </div>
            </div>
        </ClientOnly>
    );
}
