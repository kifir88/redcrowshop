import {Product} from "@/types/woo-commerce/product";
import ProductCard from "@/components/pages/category/product-card";

export default function PopularProducts({products}: {products: Product[]}) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between pb-6 pt-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Популярные предметы
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:gap-x-8">
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </main>
  )
}