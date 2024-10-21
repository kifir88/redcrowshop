import {fetchFooterPages, fetchPage} from "@/libs/strapi-rest-api";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import {cn} from "@/libs/utils";

export default async function InfoStrapiPage({
  params: { strapiPageSlug },
}: {
  params: { strapiPageSlug: string },
}) {

  const [
    strapiFooterPages,
    strapiPageData,
  ] = await Promise.all([
    fetchFooterPages(),
    fetchPage(strapiPageSlug)
  ])

  const footerPages = strapiFooterPages.data.data
    .filter(i => !['payment-error', 'payment-success'].includes(i.attributes.slug))


  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex py-10">
      <div className="hidden w-1/5 flex-col md:flex">
        {footerPages.map((page) => (
          <Link
            key={page.attributes.slug}
            className={cn(
              `w-fit hover:underline underline-offset-4`,
              strapiPageSlug === page.attributes.slug && "underline"
            )}
            href={`/info/${page.attributes.slug}`}
          >
            {page.attributes.name}
          </Link>
        ))}
      </div>
      <div className="prose w-full max-w-none lg:prose-xl">
        <ReactMarkdown>
          {strapiPageData.data.data.attributes.content.replace(
            "(/uploads",
            "(" + process.env.NEXT_PUBLIC_STRAPI_API_URL + "/uploads"
          )}
        </ReactMarkdown>
      </div>
    </div>
)
}