'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";

interface BreadcrumbItem {
  name: string;
  href: string;
}

const SlushIcon = () => (
  <svg viewBox="0 0 6 20" aria-hidden="true" className="h-5 w-auto text-gray-300">
    <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
  </svg>
)

const Breadcrumb = ({
  items,
  className,
  productName,
}: {
  items: BreadcrumbItem[],
  className?: string,
  productName?: string,
}) => {
  const pathname = usePathname()

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol role="list" className="flex items-center space-x-4 py-4">
        <li>
          <div className="flex items-center">
            <Link href="/shop" className="text-sm font-medium text-gray-700">
              Магазин
            </Link>
          </div>
        </li>
        {items.map((breadcrumb) => (
          <li key={breadcrumb.href}>
            <div className="flex items-center">
              <SlushIcon />
              <Link href={breadcrumb.href} className="ml-4 text-sm font-medium text-gray-700">
                {breadcrumb.name}
              </Link>
            </div>
          </li>
        ))}

        {productName && (
          <li className="flex items-center">
            <SlushIcon />
            <Link
              href={pathname}
              aria-current="page"
              className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-600"
            >
              {productName}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  )
}

export default Breadcrumb;