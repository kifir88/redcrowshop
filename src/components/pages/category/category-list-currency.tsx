'use client';

import {Select} from "flowbite-react";
import {useLocalStorage} from "usehooks-ts";
import {CURRENCIES, CurrencyType} from "@/libs/currency-helper";

const CurrencySelect = () => {
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT")

  return (
    <div className="max-w-md">
      <Select
        id="currencies"
        value={selectedCurrency}
        onChange={e => {
          setSelectedCurrency(e.target.value as CurrencyType)
        }}
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.value} value={currency.value}>
            {currency.label}
          </option>
        ))}
      </Select>
    </div>
  )
}

export default CurrencySelect;