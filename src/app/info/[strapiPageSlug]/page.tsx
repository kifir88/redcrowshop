import {fetchFooterPages, fetchPage, fetchWpPostPage} from "@/libs/strapi-rest-api";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import {cn} from "@/libs/utils";
import config from "@/config"

export default async function InfoStrapiPage({
  params: { strapiPageSlug },
}: {
  params: { strapiPageSlug: string },
}) {


    // Check if the environment variable is loaded and has the key
    const pageId  = config.PAGES[strapiPageSlug]
        ? config.PAGES[strapiPageSlug]
        : 0;


  const [
    strapiFooterPages,
    strapiPageData,
  ] = await Promise.all([
    fetchFooterPages(),
    //fetchPage(strapiPageSlug)
    fetch(`https://admin.redcrow.kz/wp-json/wp/v2/posts/${pageId}?v=${new Date().getTime()}`, {
        method: 'GET', // or 'POST'
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Instructs the browser to not store the cache
            'Pragma': 'no-cache', // For HTTP/1.0 compatibility
            'Expires': '0' // Proxies and others
        }
    })
  ])

   const txt = await strapiPageData.json();


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
      <div className="prose w-full lg:prose-xl">
          <div style={{maxWidth: "900px"}} dangerouslySetInnerHTML={{ __html: txt.content.rendered.replace(
                  "(/uploads",
                  "(" + process.env.NEXT_PUBLIC_STRAPI_API_URL + "/uploads"
              ) }}>
        </div>
      </div>
    </div>
)
}