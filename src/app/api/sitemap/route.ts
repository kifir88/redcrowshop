import { NextResponse } from "next/server";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

import {
    fetchCustomProductAttributes,
    fetchProductCategories,
} from "@/libs/woocommerce-rest-api";
import { fetchFooterPages } from "@/libs/strapi-rest-api";
import type { ProductCategory } from "@/types/woo-commerce/product-category";
import type { CustomProductAttribute } from "@/types/woo-commerce/custom-product-attribute";

// Required for zlib/streams in Next Route Handlers
export const runtime = "nodejs";

const HOSTNAME = "https://www.redcrow.kz";

// ---- Loose “axios-like” error typing ----
type MaybeAxiosError = {
    message?: string;
    response?: { status?: number; data?: unknown };
    config?: { url?: string };
};

const getAxiosLikeInfo = (err: unknown) => {
    const e = err as MaybeAxiosError;
    return {
        message: e?.message,
        status: e?.response?.status,
        url: e?.config?.url,
        data: e?.response?.data,
    };
};

// ---- Helpers ----
const safeArray = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

type StrapiFooterPage = {
    attributes?: {
        slug?: string;
    };
};

const generateProductAttributeCombinations = (
    options: CustomProductAttribute["options"]
): CustomProductAttribute["options"][] => {
    const result: CustomProductAttribute["options"][] = [];

    const generate = (
        start: number,
        currentCombination: CustomProductAttribute["options"]
    ) => {
        result.push([...currentCombination]);

        for (let i = start; i < options.length; i++) {
            currentCombination.push(options[i]);
            generate(i + 1, currentCombination);
            currentCombination.pop();
        }
    };

    generate(0, []);
    return result;
};

const generateAllAttributeCombinations = (
    attributes: CustomProductAttribute[]
): string[] => {
    const combinations: string[] = [];

    const combineAttributes = (index: number, currentParams: string[]) => {
        if (index === attributes.length) {
            combinations.push(currentParams.join("&"));
            return;
        }

        const currentAttribute = attributes[index];
        const optionsCombinations = generateProductAttributeCombinations(
            currentAttribute.options
        );

        optionsCombinations
            .filter((oc) => oc.length > 0)
            .forEach((oc) => {
                const formattedOptions = oc.map((o) => o.slug).join("-i-");
                const formattedProductAttributeSlug = currentAttribute.slug.replace(
                    "pa_",
                    ""
                );
                combineAttributes(index + 1, [
                    ...currentParams,
                    `${formattedProductAttributeSlug}=${formattedOptions}`,
                ]);
            });
    };

    // all attributes combined
    combineAttributes(0, []);

    // each attribute separately
    attributes.forEach((attribute) => {
        const optionsCombinations = generateProductAttributeCombinations(
            attribute.options
        );

        optionsCombinations
            .filter((oc) => oc.length > 0)
            .forEach((oc) => {
                const formattedOptions = oc.map((o) => o.slug).join("-i-");
                const formattedProductAttributeSlug = attribute.slug.replace("pa_", "");
                combinations.push(`${formattedProductAttributeSlug}=${formattedOptions}`);
            });
    });

    return combinations;
};

const processCategoriesForSitemap = async (
    categoriesData: ProductCategory[],
    sitemap: SitemapStream
) => {
    for (const category of safeArray<ProductCategory>(categoriesData)) {
        if (!category) continue;
        if (!category.slug) continue;
        if (category.slug === "musor") continue;

        sitemap.write({
            url: `/category/${category.slug}`,
            changefreq: "weekly",
            priority: 0.9,
        });

        // If you re-enable this, wrap with try/catch so it can't break sitemap on 401
        /*
        try {
          const productAttributes = await fetchCustomProductAttributes(
            { category_name: category.slug },
            false
          );
          const allCombinations = generateAllAttributeCombinations(productAttributes);

          allCombinations.forEach((combination) => {
            sitemap.write({
              url: `/category/${category.slug}?${combination}`,
              changefreq: "weekly",
              priority: 0.8,
            });
          });
        } catch (err) {
          console.error("SITEMAP: attributes failed", getAxiosLikeInfo(err));
        }
        */
    }
};

export async function GET() {
    // During `next build` / export env/auth may be missing -> 401.
    // Skip external calls so the build won't crash.
    const isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

    const sitemap = new SitemapStream({ hostname: HOSTNAME });
    const pipeline = sitemap.pipe(createGzip());

    // Always include base URLs
    sitemap.write({ url: `/`, changefreq: "weekly", priority: 0.9 });
    sitemap.write({ url: `/shop`, changefreq: "weekly", priority: 0.9 });
    sitemap.write({ url: `/cart`, changefreq: "weekly", priority: 0.9 });

    if (!isBuildPhase) {
        // Woo categories (never throw)
        try {
            const categoriesRes = (await fetchProductCategories({
                exclude: [378],
                per_page: 50,
            })) as unknown;

            const categories = safeArray<ProductCategory>(
                (categoriesRes as any)?.data?.data ?? (categoriesRes as any)?.data
            );

            await processCategoriesForSitemap(categories, sitemap);
        } catch (err) {
            console.error("SITEMAP: Woo categories failed", getAxiosLikeInfo(err));
        }

        // Strapi footer pages (never throw)
        try {
            const strapiRes = (await fetchFooterPages()) as unknown;

            const pages = safeArray<StrapiFooterPage>(
                (strapiRes as any)?.data?.data ?? (strapiRes as any)?.data
            );

            for (const sfp of pages) {
                const slug = sfp.attributes?.slug;
                if (!slug) continue;

                sitemap.write({
                    url: `/info/${slug}`,
                    changefreq: "weekly",
                    priority: 0.9,
                });
            }
        } catch (err) {
            console.error("SITEMAP: Strapi pages failed", getAxiosLikeInfo(err));
        }
    }

    sitemap.end();

    // streamToPromise returns Buffer -> convert to Uint8Array for NextResponse BodyInit typing
    const gzBuffer = await streamToPromise(pipeline); // Buffer
    const body = new Uint8Array(gzBuffer);

    return new NextResponse(body, {
        headers: {
            "Content-Type": "application/xml",
            "Content-Encoding": "gzip",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
