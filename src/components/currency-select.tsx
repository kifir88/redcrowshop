'use client';

import {Select} from "flowbite-react";
import {useLocalStorage} from "usehooks-ts";
import {CURRENCIES, CurrencyType} from "@/libs/currency-helper";
import {useEffect, useState} from "react";

const CurrencySelect = () => {

    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("KZT");
    const [storedCurrency, setStoredCurrency] = useLocalStorage<CurrencyType>("currency", "KZT");

    useEffect(() => {
        if (storedCurrency) {
            setSelectedCurrency(storedCurrency);
        }
    }, [storedCurrency]);
  return (
    <div className="max-w-md">
      <Select
        id="currencies"
        value={selectedCurrency}
        className={'ml-2'}
        onChange={e => {
            setStoredCurrency(e.target.value as CurrencyType);
           setSelectedCurrency(e.target.value as CurrencyType);
        }}
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.value} value={currency.value}>
            {currency.value}
          </option>
        ))}
      </Select>
    </div>
  )
}

export default CurrencySelect;