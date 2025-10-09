import {
    fetchCurrencyRates,
    fetchProductCategories,
    fetchProducts,
    fetchProductVariations
} from "@/libs/woocommerce-rest-api";
import Breadcrumb from "@/components/breadcrumb";
import { getCategoryHierarchyBySlug } from "@/libs/helper-functions";
import ProductCard from "@/components/pages/category/product-card";
import ProductImageAttribute from "@/components/pages/product/product-image-attribute";
import { Product } from "@/types/woo-commerce/product";
import { AppPageProps } from "@/types/next";
import { Metadata, ResolvingMetadata } from "next";


type ProductPageParams = {
    slug: string;
    productSlug: string;
};



export async function generateMetadata(
    props: AppPageProps<ProductPageParams>,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { params } = props;
    const { productSlug } = await params; // ✅ await here

    const productsData = await fetchProducts({ slug: productSlug });
    const productData = productsData?.data[0];

    const productVariationsData = await fetchProductVariations(productData.id, {
        parent: productData.id,
        per_page: 50,
    });

    const formattedVariationsForDescription = productVariationsData
        .map((pv) =>
            pv.attributes.map((a) => `${a.name} ${a.option}`.toLowerCase()).join(" и ")
        )
        .join(", ");

    return {
        title: productData?.name,
        description: `${productData?.name.toLowerCase()} ${formattedVariationsForDescription}`,
        keywords: [
            "REDCROW Казахстан",
            productData?.name,
            formattedVariationsForDescription,
        ],
    };
}

export default async function ProductPage(props: AppPageProps<ProductPageParams>) {
    const { params } = props;
    const { slug, productSlug } = await params;

    const productsData = await fetchProducts({ slug: productSlug });
    const productData = productsData?.data[0];

    const [
        currencyRatesData,
        productsRecommendedData,
        productCategoriesData,
        productVariationsData,
    ] = await Promise.all([
        fetchCurrencyRates(),
        fetchProducts({
            include: productData.related_ids,
            per_page: 3,
        }, false),
        fetchProductCategories({
            exclude: [378],
        }),
        fetchProductVariations(productData.id, {
            parent: productData.id,
            per_page: 50,
        }, false),
    ]);

    const breadCrumbItems = getCategoryHierarchyBySlug(
        productCategoriesData?.data,
        slug
    ).map((pc) => ({ name: pc.name, href: `/category/${pc.slug}` }));

    return (
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <Breadcrumb items={breadCrumbItems} productName={productData?.name} />

            <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
                <ProductImageAttribute
                    product={productData}
                    productVariations={productVariationsData}
                    currencyRates={currencyRatesData.data}
                />
            </div>

            <div className="mt-20 mb-10">
                <h1 className="text-xl font-medium text-gray-900 mb-6">
                    Вам также может понравится
                </h1>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:gap-x-8">
                    {productsRecommendedData?.data?.map((product: Product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            currencyRates={currencyRatesData.data}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
