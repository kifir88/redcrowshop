import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

const Breadcrumb = ({items, className}: {items: BreadcrumbItem[], className?: string}) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol role="list" className="flex items-center space-x-4 py-4">
        <li>
          <div className="flex items-center">
            <Link href="/category" className="text-sm font-medium text-gray-700">
              Магазин
            </Link>
          </div>
        </li>
        {items.map((breadcrumb) => (
          <li key={breadcrumb.href}>
            <div className="flex items-center">
              <svg viewBox="0 0 6 20" aria-hidden="true" className="h-5 w-auto text-gray-300">
                <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
              </svg>
              <Link href={breadcrumb.href} className="ml-4 text-sm font-medium text-gray-700">
                {breadcrumb.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb;