import { CustomCurrencyRates } from "@/types/woo-commerce/custom-currency-rates";

export type CurrencyType = "EUR" | "KZT" | "RUB" | "USD";

export type CurrencyItem = {
  value: CurrencyType;
  label: string;
  symbol: string;
};

export const CURRENCIES: CurrencyItem[] = [
  {
    value: "EUR",
    label: "Евро",
    symbol: "&euro;",
  },
  {
    value: "KZT",
    label: "Казахстанский Тенге",
    symbol: "&#8376;",
  },
  {
    value: "RUB",
    label: "Российский Рубль",
    symbol: "&#8381;",
  },
  {
    value: "USD",
    label: "Американский Доллар",
    symbol: "&#36;",
  },
];

/**
 * Конвертация валют без форматироания
 * @param value Сумма
 * @param selectedCurrency Выбранная валюта
 * @param currRates Курсы валют
 * @returns number
 * Возвращает число
 */
export const amountCurrency = (
  value: number,
  selectedCurrency: CurrencyType | null,
  currRates: CustomCurrencyRates
) => {

  if (!selectedCurrency) return 0;

  const currencyFormats:
    Record<
      CurrencyType,
      {
        locale: string,
        currency: CurrencyType,
        digits: number,
        rate: string | number,
      }
    > = {
    USD: { locale: "en-US", currency: "USD", digits: 2, rate: currRates.USD },
    EUR: { locale: "en-US", currency: "EUR", digits: 2, rate: currRates.EUR },
    KZT: { locale: "ru-KZ", currency: "KZT", digits: 0, rate: 1 },
    RUB: { locale: "ru-RU", currency: "RUB", digits: 0, rate: currRates.RUB },
  };

  const { locale, currency, digits, rate } = currencyFormats[selectedCurrency] || {};

  if (!locale) return 0;

  const amount = value * parseFloat(String(rate));

  return amount;
};

/**
 * Форматирование валюты с конвертированием для отображения
 * @param value Сумма
 * @param selectedCurrency Выбранная валюта
 * @param currRates Курсы валют
 * @param convert Выполнять конвертацию?
 * @returns 
 */
export const formatCurrency = (
  value: number,
  selectedCurrency: CurrencyType | null,
  currRates: CustomCurrencyRates,
  convert: boolean = true
) => {

  if (!selectedCurrency) return "";

  const currencyFormats:
    Record<
      CurrencyType,
      {
        locale: string,
        currency: CurrencyType,
        digits: number,
        rate: string | number,
      }
    > = {
    USD: { locale: "en-US", currency: "USD", digits: 2, rate: currRates.USD },
    EUR: { locale: "en-US", currency: "EUR", digits: 2, rate: currRates.EUR },
    KZT: { locale: "ru-KZ", currency: "KZT", digits: 0, rate: 1 },
    RUB: { locale: "ru-RU", currency: "RUB", digits: 0, rate: currRates.RUB },
  };

  const { locale, currency, digits, rate } = currencyFormats[selectedCurrency] || {};

  if (!locale) return "";

  const amount = convert ? (value * parseFloat(String(rate))) : value;
  return new Intl.NumberFormat(
    locale,
    {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    .format(amount);
};
