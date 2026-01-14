import CategoryListSortMenu from "@/components/pages/category/category-list-sort-menu";
import {
    fetchCurrencyRates,
    fetchProducts,
} from "@/libs/woocommerce-rest-api";
import ProductCard from "@/components/pages/category/product-card";
import Breadcrumb from "@/components/breadcrumb";
import Filters from "@/components/pages/category/filters";
import CategoryListPagination from "@/components/pages/category/category-list-pagination";
import { Product } from "@/types/woo-commerce/product";
import { cn } from "@/libs/utils";
import MobileFilters from "@/components/pages/category/mobile-filters";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const {
        search: searchParam,
        max_price: maxPriceParam,
        min_price: minPriceParam,
        page: pageParam,
        order: orderSearchParam,
        orderby: orderbySearchParam,
        ...attributeSearchParams
    } = await searchParams;

    
    const allowedSearchParams = ['razmer', 'tsvet', 'sale']
    const formattedSearchParams = Object
        .entries(attributeSearchParams)
        .filter(([key]) => allowedSearchParams.includes(key))
        .reduce(
            (acc, [key, value]) => {
                if (value) acc[`attr-${key}`] = value;
                return acc;
            },
            {} as Record<string, string>
        );


    const orderFiltersExist = orderSearchParam && orderbySearchParam;

    const [currencyRatesData, productsData, productCategoryMaxPriceData] =
        await Promise.all([
            fetchCurrencyRates(),
            fetchProducts({
                order: orderFiltersExist ? orderSearchParam : undefined,
                orderby: orderFiltersExist ? orderbySearchParam : undefined,
                page: pageParam ? Number(pageParam) : 1,
                per_page: 12,
                search: searchParam ?? undefined,
                max_price: maxPriceParam ? Number(maxPriceParam) : 1000000000,
                min_price: minPriceParam ? Number(minPriceParam) : 0,
                stock_status: "instock",
                ...formattedSearchParams,
            }),
            fetchProducts({
                per_page: 1,
                order: "desc",
                orderby: "price",
                stock_status: "instock",
            }),
        ]);

    const productCategoryMaxPrice = productCategoryMaxPriceData.data[0]?.price;
    const productCategoryMaxPriceValue = productCategoryMaxPrice
        ? Number(productCategoryMaxPrice)
        : 0;
    const totalPages: string = productsData?.totalPages;

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
             <div>
                <Breadcrumb items={[]} />
            </div>
            
            {/* <div className="flex items-baseline justify-between pb-6 pt-10">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Магазин
                </h1>
            </div>  */}

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
                <h2 id="products-heading" className="sr-only">
                    Products
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {/* Desktop Filters */}
                    <Filters
                        className="hidden lg:block"
                        productMaxPrice={productCategoryMaxPriceValue}
                        currencyRates={currencyRatesData.data}
                    />

                    {/* Product grid */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3 h-min space-y-6">
                        {/* Top controls */}
                        <div
                            className={cn(
                                "flex flex-col md:flex-row justify-between md:items-center gap-y-5"
                            )}
                        >
                            <div className="flex justify-between w-full h-min">
                                <CategoryListSortMenu />

                            </div>

                            <MobileFilters
                                productMaxPrice={productCategoryMaxPriceValue}
                                currencyRates={currencyRatesData.data}
                            />
                        </div>

                        {/* 🔹 Pagination ABOVE products (centered horizontally) */}
                        <div className="flex justify-center">
                            <CategoryListPagination
                                currentPage={pageParam ?? "1"}
                                totalPages={totalPages}
                            />
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:gap-x-8">
                            {!productsData?.data.length && (
                                <div
                                    className={cn(
                                        "col-span-1 sm:col-span-2 md:col-span-3 h-min",
                                        "flex justify-center items-center"
                                    )}
                                >
                                    <p className="text-center text-balance text-lg md:text-xl font-medium text-gray-900">
                                        Товаров по заданным параметрам не найдено
                                    </p>
                                </div>
                            )}

                            {productsData?.data.map((product: Product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    currencyRates={currencyRatesData.data}
                                />
                            ))}
                        </div>

                        {/* 🔹 Pagination BELOW products (centered horizontally) */}
                        <div className="flex justify-center">
                            <CategoryListPagination
                                currentPage={pageParam ?? "1"}
                                totalPages={totalPages}
                            />
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
