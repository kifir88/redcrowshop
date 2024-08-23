import React from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import qs from "query-string";
import { motion } from "framer-motion";
import useProductCategories from "@/hooks/product-categories/useProductCategories";
import Collection from "@/components/ui/components/collection";
import {ProductCategory} from "@/types/woo-commerce/product-category";

function DropdownMenu({
  navItem,
  isOpen,
  toggleOpen,
  toggleClose,
}: {
  navItem: ProductCategory;
  isOpen: boolean;
  toggleOpen: () => void;
  toggleClose: () => void;
}) {
  const {data} = useProductCategories({ parent: navItem.id })

  const content = (
    <motion.div
      key={isOpen ? "open" : null}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.2 }}
      className="w-full py-8 text-lg"
    >
      <div className="flex flex-col justify-start gap-x-40">
        {data?.data.map((prod, i) => {
          const href = qs.stringifyUrl({
            url: '/shop',
            query: {
              category: navItem.slug,
              subcategory: prod.slug
            }
          })

          return (
            <div key={i} className="flex flex-col">
              <Link
                href={href}
                className="font-bold w-fit transition duration-300 hover:text-black"
              >
                {`• ${prod.name}`}
              </Link>

              {!!prod.count && <Collection category={navItem} subcategory={prod} />}
            </div>
          )
        })}
      </div>
    </motion.div>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden text-left md:inline-block">
        <Link
          href={`/shop?category=${navItem.slug}`}
          className="text-base font-normal tracking-[1.5px] transition duration-300 hover:text-black"
          onMouseEnter={toggleOpen}
        >
          {navItem.name}
        </Link>

        <motion.div
          initial={{ y: "-100%" }}
          animate={{
            y: isOpen ? 0 : "-100%",
          }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5 }}
          onMouseEnter={toggleOpen}
          onMouseLeave={toggleClose}
          className={`${
            isOpen
              ? "pointer-events-auto top-full"
              : "pointer-events-none top-full"
          } absolute inset-0 -z-20  h-fit bg-white`}
        >
          {content}
        </motion.div>
      </div>

      {isOpen && (
        <div
          onClick={toggleClose}
          className="fixed inset-0 top-20 -z-30 h-screen w-screen bg-white opacity-40"
        ></div>
      )}
      {/* // Mobile */}
      <div
        className="relative inline-block text-left md:hidden"
        // onClick={() => void router.push(hrefMain)}
      >
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex w-full items-center justify-between text-base font-normal tracking-[1.5px]">
                <Link href={`/shop?category=${navItem.slug}`}>
                  {navItem.name}
                </Link>
                <Disclosure.Button>
                  <ChevronDownIcon
                    className={`${open ? "rotate-180 transform" : ""}  h-8 w-8`}
                  />
                </Disclosure.Button>
              </div>
              <Disclosure.Panel className="flex flex-col pl-2 text-[12px] font-normal">
                {content}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}

export default DropdownMenu;
