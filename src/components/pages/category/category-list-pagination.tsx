'use client';

import {Pagination} from "flowbite-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";

export default function CategoryListPagination({
  currentPage,
  totalPages,
}: {
  currentPage: string;
  totalPages: string;
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onPageChange = (page: number) => {
    const currentParams = qs.parse(searchParams.toString());

    const newParams = {
      ...currentParams,
      page: page,
    };

    const url = qs.stringifyUrl({
      url: pathname,
      query: newParams,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url)
  };

  return (
    <div className="flex overflow-x-auto sm:justify-center w-full lg:col-span-3">
      <Pagination
        layout="pagination"
        currentPage={Number(currentPage)}
        totalPages={Number(totalPages)}
        onPageChange={onPageChange}
        previousLabel="Назад"
        nextLabel="Вперед"
        showIcons
      />
    </div>
  )
}