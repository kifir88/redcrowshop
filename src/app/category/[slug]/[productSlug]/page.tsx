import {
    fetchCurrencyRates,
    fetchProductCategories,
    fetchProducts,
    fetchProductVariations
} from "@/libs/woocommerce-rest-api";
import Breadcrumb from "@/components/breadcrumb";
import { getCategoryHierarchyBySlug } from "@/libs/helper-functions";
import ProductCard from "@/components/pages/category/product-card";
import ProductInfo from "@/components/pages/product/product-info";
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
            stock_status: "instock",
        }, false),
        fetchProductCategories({
            exclude: [378], per_page: 50
        }),
        fetchProductVariations(productData.id, {
            parent: productData.id,
            per_page: 50,
        }, false),
    ]);

    //если у вариации нет изображения, подставляем из другого размера.
    productVariationsData.map(variation => {
        let v_color = variation.attributes.find(a => a.name == 'Цвет')?.option
        let hasImage = variation?.image != null
        let equalBaseImage = productData.images.find((gg) => variation?.image?.src == gg.src) != null;
        let variationProductWithImage = null;
        if ((!hasImage || equalBaseImage) && v_color) {
            variationProductWithImage = productVariationsData.find(pv =>
                pv.image != null && productData.images.find((gg) => pv?.image?.src == gg.src) == null &&
                pv.attributes
                    .every(attribute => attribute.name.toLowerCase() == "размер" || (
                        v_color === attribute.option)
                    )
            );
            if (variationProductWithImage) {
                variation.image = variationProductWithImage.image
            }
        }
    })
    //Исключаем out-of-stock вариации
    const filteredProductVariations = productVariationsData.filter(i => i.stock_quantity != 0)


    //Исключаем дубли в рамках цвета, предполагается что для каждого цвета есть фото.
    const productVariationImages = Object.values(
        filteredProductVariations.reduce((acc, pv) => {
            const color = pv.attributes.find(
                attr => attr.name.toLowerCase() === "цвет"
            );
            if (color && pv.image?.src) {
                const key = `${color.option}_${pv.image.src}`;
                if (!acc[key]) {
                    acc[key] = pv.image;
                }
            }

            return acc;
        }, {} as Record<string, any>)
    );


    const productImages = productData.images
        ?.map(i => i)
        ?.filter(i => i !== null);


    const allProductImages = [...(productImages ?? []), ...(productVariationImages ?? [])].filter((img):any => img !== null);



    const breadCrumbItems = getCategoryHierarchyBySlug(
        productCategoriesData?.data,
        slug
    ).map((pc) => ({ name: pc.name, href: `/category/${pc.slug}` }));

    return (
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <Breadcrumb items={breadCrumbItems} productName={productData?.name} />

            <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
                <ProductInfo
                    product={productData}
                    productVariations={filteredProductVariations}
                    currencyRates={currencyRatesData.data}
                    allProductImages={allProductImages}
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
