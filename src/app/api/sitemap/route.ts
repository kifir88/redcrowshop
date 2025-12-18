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

// Required for zlib/streams
export const runtime = "nodejs";

const HOSTNAME = "https://www.redcrow.kz";

// ---- Types for safer access (keeps your libs untouched) ----
type MaybeAxiosError = {
    message?: string;
    response?: { status?: number; data?: unknown };
    config?: { url?: string };
};

type WooCategoriesResponse = {
    data: ProductCategory[];
};

type StrapiFooterPagesResponse = {
    data: {
        data: Array<{
            attributes: { slug: string };
        }>;
    };
};

// ---- Helpers ----
const safeArray = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const getAxiosLikeInfo = (err: unknown) => {
    const e = err as MaybeAxiosError;
    return {
        message: e?.message,
        status: e?.response?.status,
        url: e?.config?.url,
        data: e?.response?.data,
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

    combineAttributes(0, []);

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

        // If you ever re-enable this block, keep it wrapped in try/catch
        // because it can also 401 and break the sitemap.
        /*
        try {
          const productAttributes = await fetchCustomProductAttributes(
            { category_name: category.slug },
            false
          );

          const allCombinations = generateAllAttributeCombinations(productAttributes);

          allCombinations.forEach((combination) => {
            const combinationUrl = `/category/${category.slug}?${combination}`;
            sitemap.write({ url: combinationUrl, changefreq: "weekly", priority: 0.8 });
          });
        } catch (err) {
          console.error("SITEMAP: attributes failed", getAxiosLikeInfo(err));
        }
        */
    }
};

export async function GET() {
    // During next build / export, external APIs often don’t have env/auth -> 401.
    // We skip them so build won’t fail.
    const isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

    const sitemap = new SitemapStream({ hostname: HOSTNAME });
    const pipeline = sitemap.pipe(createGzip());

    // Always include base routes (so sitemap still exists even if APIs fail)
    sitemap.write({ url: `/`, changefreq: "weekly", priority: 0.9 });
    sitemap.write({ url: `/shop`, changefreq: "weekly", priority: 0.9 });
    sitemap.write({ url: `/cart`, changefreq: "weekly", priority: 0.9 });

    if (!isBuildPhase) {
        // Woo categories (never throw)
        try {
            const categoriesRes = (await fetchProductCategories({
                exclude: [378],
                per_page: 50,
            })) as unknown as WooCategoriesResponse;

            await processCategoriesForSitemap(categoriesRes?.data ?? [], sitemap);
        } catch (err) {
            console.error("SITEMAP: Woo categories failed", getAxiosLikeInfo(err));
        }

        // Strapi footer pages (never throw)
        try {
            const strapiRes =
                (await fetchFooterPages()) as unknown as StrapiFooterPagesResponse;

            const pages = safeArray(strapiRes?.data?.data);

            for (const sfp of pages) {
                const slug = sfp?.attributes?.slug;
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

    const sitemapOutput = await streamToPromise(pipeline);

    return new NextResponse(sitemapOutput, {
        headers: {
            "Content-Type": "application/xml",
            "Content-Encoding": "gzip",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
