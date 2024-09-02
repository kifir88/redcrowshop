"use client"

import {Button, Drawer} from "flowbite-react";
import React, {useState} from "react";
import Filters from "@/components/pages/category/filters";
import {SlidersHorizontalIcon} from "lucide-react";

export default function MobileFilters({
  productSlug,
  productMaxPrice,
}: {
  productSlug?: string;
  productMaxPrice: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        className="md:hidden"
        color="dark"
        outline
        size="xs"
      >
        <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
        Фильтры
      </Button>

      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header
          title="Фильтры"
          titleIcon={SlidersHorizontalIcon}
        />
        <Drawer.Items>
          <Filters
            productSlug={productSlug}
            className=""
            productMaxPrice={productMaxPrice}
          />
        </Drawer.Items>
      </Drawer>
    </>
  )
}