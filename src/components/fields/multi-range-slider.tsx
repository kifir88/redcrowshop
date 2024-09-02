"use client"

import {
  ChangeEvent,
  FC,
  useCallback,
  useRef,
  useState
} from "react";
import classnames from "classnames";
import "./multiRangeSlider.css";
import {CustomCurrencyRates} from "@/types/woo-commerce/custom-currency-rates";
import {CurrencyType, formatCurrency} from "@/libs/currency-helper";
import {useLocalStorage} from "usehooks-ts";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: (values: { min: number; max: number }) => void;
  currencyRates: CustomCurrencyRates;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({ min, max, onChange, currencyRates }) => {
  const [selectedCurrency] = useLocalStorage<CurrencyType>("currency", "KZT")

  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const updateRange = (newMinVal: number, newMaxVal: number) => {
    const minPercent = getPercent(newMinVal);
    const maxPercent = getPercent(newMaxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  };

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(+event.target.value, maxVal - 1);
    setMinVal(value);
    event.target.value = value.toString();
    updateRange(value, maxVal);
    onChange({ min: value, max: maxVal });
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(+event.target.value, minVal + 1);
    setMaxVal(value);
    event.target.value = value.toString();
    updateRange(minVal, value);
    onChange({ min: minVal, max: value });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          ref={minValRef}
          onChange={handleMinChange}
          className={classnames("thumb thumb--zindex-3", {
            "thumb--zindex-5": minVal > max - 100
          })}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          ref={maxValRef}
          onChange={handleMaxChange}
          className="thumb thumb--zindex-4"
        />

        <div className="slider">
          <div className="slider__track"></div>
          <div ref={range} className="slider__range"></div>
        </div>
      </div>
      <div className="mt-5 flex justify-between w-full">
        <div className="text-sm text-gray-600 cursor-pointer">
          {formatCurrency(minVal, selectedCurrency, currencyRates)}
        </div>
        <div className="text-sm text-gray-600 cursor-pointer">
          {formatCurrency(maxVal, selectedCurrency, currencyRates)}
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
