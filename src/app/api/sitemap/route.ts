import { NextResponse } from 'next/server';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import {fetchProductCategories} from "@/libs/woocommerce-rest-api";
import {fetchFooterPages} from "@/libs/strapi-rest-api";

export async function GET() {
  try {
    // Fetch the product categories
    const categoriesData = await fetchProductCategories();
    const strapiFooterPagesData = await fetchFooterPages()

    // Set up sitemap stream and gzip it
    const sitemap = new SitemapStream({ hostname: `https://www.redcrow.kz` });
    const pipeline = sitemap.pipe(createGzip());

    sitemap.write({ url: `/`, changefreq: 'weekly', priority: 0.8 });
    sitemap.write({ url: `/shop`, changefreq: 'weekly', priority: 0.8 });
    sitemap.write({ url: `/cart`, changefreq: 'weekly', priority: 0.8 });

    // Add each strapi page to the sitemap
    strapiFooterPagesData.data.data.forEach((sfp) => {
      sitemap.write({ url: `/info/${sfp.attributes.slug}`, changefreq: 'weekly', priority: 0.8 });
    });

    // Add each category to the sitemap
    categoriesData.data.forEach((category) => {
      sitemap.write({ url: `/category/${category.slug}`, changefreq: 'weekly', priority: 0.8 });
    });

    sitemap.end();

    // Convert the stream to a promise
    const sitemapOutput = await streamToPromise(pipeline);

    // Return the sitemap XML content
    return new NextResponse(sitemapOutput, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Encoding': 'gzip',
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(null, { status: 500 });
  }
}


// import { getServerSideSitemap } from 'next-sitemap'
// import {fetchProductCategories} from "@/libs/woocommerce-rest-api";
//
// export async function GET(request: Request) {
//   // Method to source urls from cms
//   // const urls = await fetch('https//example.com/api')
//   const categoriesRes = await fetchProductCategories();
//
//
//   return getServerSideSitemap([
//     {
//       loc: 'https://example.com',
//       lastmod: new Date().toISOString(),
//       // changefreq
//       // priority
//     },
//     {
//       loc: 'https://example.com/dynamic-path-2',
//       lastmod: new Date().toISOString(),
//       // changefreq
//       // priority
//     },
//   ])
// }