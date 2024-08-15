'use client';

import {Attribute} from "@/types/woo-commerce/product";
import AttributeAutoComplete from "@/components/fields/attribute-auto-complete";
import {useForm} from "@mantine/form";

type FormValues = Record<string, string | undefined>;

export default function ProductDetailAttributesForm({
  attributes,
}: {
  attributes: Attribute[]
}) {

  const form = useForm<FormValues>({
    initialValues: {}
  })

  const isAddToCartButtonDisabled = Object
    .keys(form.values)
    .length !== attributes.length;

  const handleSubmit = (formValue: FormValues) => {
    console.log(formValue, "formValues")
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {attributes.map(a => (
        <div key={a.id} className="mt-6">
          <AttributeAutoComplete
            label={a.name}
            attribute={a}
            value={form.values[a.id]}
            onChange={value => {
              form.setFieldValue(String(a.id), String(value))
            }}
          />
        </div>
      ))}

      <button
        type="submit"
        className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={isAddToCartButtonDisabled}
      >
        Добавить в корзину
      </button>
    </form>
  )
}
