import {Product} from "@/types/woo-commerce/product";
import Link from "next/link";

const ProductCard = ({product}: {product: Product}) => {
  const image = product.images[0]

  return (
    <Link
      key={product.id}
      href={`/product/${product.id}`}
      className="group text-sm"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
        <img
          alt={image?.alt || "placeholder"}
          src={image?.src || "/category/product-image-placeholder.png"}
          className="aspect-square h-full w-full object-cover object-center"
        />
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{product.name}</h3>
      <p className="italic text-gray-500">{product.categories[0]?.name}</p>
      <p className="mt-2 font-medium text-gray-900">
        {product.price || product.sale_price || product.regular_price || 0}
        {" "}
        {"₸"}
      </p>
    </Link>
  )
}

export default ProductCard;