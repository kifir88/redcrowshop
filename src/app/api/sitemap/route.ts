import { NextResponse } from 'next/server';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import {
  fetchCustomProductAttributes,
  fetchProductCategories
} from "@/libs/woocommerce-rest-api";
import {fetchFooterPages} from "@/libs/strapi-rest-api";
import {ProductCategory} from "@/types/woo-commerce/product-category";
import {CustomProductAttribute} from "@/types/woo-commerce/custom-product-attribute";


const generateProductAttributeCombinations = (options: CustomProductAttribute['options']): CustomProductAttribute['options'][] => {
  const result: CustomProductAttribute['options'][] = [];

  const generate = (start: number, currentCombination: CustomProductAttribute['options']) => {
    result.push([...currentCombination]); // Store current combination

    for (let i = start; i < options.length; i++) {
      currentCombination.push(options[i]);
      generate(i + 1, currentCombination); // Recursively generate combinations
      currentCombination.pop(); // Backtrack to generate other combinations
    }
  };

  generate(0, []); // Start from index 0 with an empty combination
  return result;
};

// Helper function to generate all attribute combinations across multiple attributes
const generateAllAttributeCombinations = (attributes: CustomProductAttribute[]): string[] => {
  const combinations: string[] = [];

  // Helper to recursively combine across different attributes
  const combineAttributes = (index: number, currentParams: string[]) => {
    if (index === attributes.length) {
      combinations.push(currentParams.join("&"));
      return;
    }

    const currentAttribute = attributes[index];
    const optionsCombinations = generateProductAttributeCombinations(currentAttribute.options);

    optionsCombinations
      .filter(oc => !!oc.length)
      .forEach(oc => {
        const formattedOptions = oc.map(o => o.slug).join("-i-");
        const formattedProductAttributeSlug = currentAttribute.slug.replace("pa_", "");
        combineAttributes(index + 1, [...currentParams, `${formattedProductAttributeSlug}=${formattedOptions}`]);
      });
  };

  // Generate full attribute combinations (all attributes combined)
  combineAttributes(0, []);

  // Generate individual attribute variations (each attribute on its own)
  attributes.forEach(attribute => {
    const optionsCombinations = generateProductAttributeCombinations(attribute.options);

    optionsCombinations
      .filter(oc => !!oc.length)
      .forEach(oc => {
        const formattedOptions = oc.map(o => o.slug).join("-i-");
        const formattedProductAttributeSlug = attribute.slug.replace("pa_", "");
        combinations.push(`${formattedProductAttributeSlug}=${formattedOptions}`);
      });
  });

  return combinations;
};

// Refactored function to process categories and attributes for the sitemap
const processCategoriesForSitemap = async (categoriesData: ProductCategory[], sitemap: SitemapStream) => {
  for (const category of categoriesData) {
    sitemap.write({ url: `/category/${category.slug}`, changefreq: 'weekly', priority: 0.8 });

    const productAttributes = await fetchCustomProductAttributes({
      category_name: category.slug,
    });

    const allCombinations = generateAllAttributeCombinations(productAttributes.data);

    allCombinations.forEach(combination => {
      const combinationUrl = `/category/${category.slug}?${combination}`;
      sitemap.write({ url: combinationUrl, changefreq: 'weekly', priority: 0.7 });
    });
  }
};

export async function GET() {
  try {
    // Fetch the product categories
    const categoriesData = await fetchProductCategories({
      exclude: [320],
    });
    const strapiFooterPagesData = await fetchFooterPages();
    // const attributesData = await fetchProductAttributes();

    // Set up sitemap stream and gzip it
    const sitemap = new SitemapStream({ hostname: `https://www.redcrow.kz` });
    const pipeline = sitemap.pipe(createGzip());

    sitemap.write({ url: `/`, changefreq: 'weekly', priority: 0.9 });
    sitemap.write({ url: `/shop`, changefreq: 'weekly', priority: 0.8 });
    sitemap.write({ url: `/cart`, changefreq: 'weekly', priority: 0.8 });

    // Add each strapi page to the sitemap
    strapiFooterPagesData.data.data.forEach((sfp) => {
      sitemap.write({ url: `/info/${sfp.attributes.slug}`, changefreq: 'weekly', priority: 0.7 });
    });

    // Process the categories and product attributes for the sitemap
    await processCategoriesForSitemap(categoriesData.data, sitemap);

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