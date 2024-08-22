'use client';

import {Product} from "@/types/woo-commerce/product";
import Link from "next/link";
import {useParams} from "next/navigation";

const ProductCard = ({product}: {product: Product}) => {
  const params = useParams();

  const image = product.images[0];
  const imageSrc = image?.src || "/category/product-image-placeholder.png";
  const imageAlt = image?.alt || "placeholder";

  return (
    <Link
      key={product.id}
      href={`/category/${params.slug}/${product.slug}`}
      className="group text-sm"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
        <img
          className="aspect-square h-full w-full object-cover object-center"
          src={imageSrc}
          alt={imageAlt}
        />
      </div>
      <h3 className="mt-4 font-medium text-gray-900">{product.name}</h3>
      <p className="italic text-gray-500">{product.categories[0]?.name}</p>
      <div
        className="mt-2 font-medium text-gray-900"
        dangerouslySetInnerHTML={{__html: product.price_html}}
      />
    </Link>
  )
}

export default ProductCard;