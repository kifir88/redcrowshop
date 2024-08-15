import AutoComplete, {AutoCompleteProps} from "@/components/fields/auto-complete";
import {Attribute} from "@/types/woo-commerce/product";
import useProductAttributeTerms from "@/hooks/product-attribute-terms/useProductAttributeTerms";
import {useEffect, useState} from "react";

interface AttributeAutoCompleteProps extends Pick<
  AutoCompleteProps, "label" | "value" | "onChange"
> {
  attribute: Attribute
}

export default function AttributeAutoComplete({
  attribute,
  label,
  value,
  onChange,
}: AttributeAutoCompleteProps) {
  const {
    data,
    isLoading,
    isSuccess,
  } = useProductAttributeTerms(attribute.id)

  const [options, setOptions] = useState<AutoCompleteProps['items']>([])

  useEffect(() => {
    if (isSuccess && data?.data) {
      setOptions(data.data.map(i => (
        { label: i.name, value: String(i.id) }
      )))
    }
  }, [isSuccess, data?.data])

  return (
    <AutoComplete
      label={label}
      items={options}
      isLoading={isLoading}
      value={value}
      onChange={onChange}
    />
  )
}