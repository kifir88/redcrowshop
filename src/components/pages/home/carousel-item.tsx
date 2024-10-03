import {cn} from "@/libs/utils";
import Link from "next/link";
import {StrapiSliderAttributes} from "@/types/strapi/strapi-slider";
import Image from "next/image";

const getContent = (
  locale: string,
  currentLocale: string,
  internalText?: string,
  externalText?: string
) => {
  let localizedContent;

  if (locale === currentLocale) {
    localizedContent = locale === "ru" ? internalText : externalText;
  } else {
    localizedContent = locale === "ru" ? externalText : internalText;
  }

  return localizedContent || internalText || externalText;
};

export default function CarouselItem({
  item,
  locale,
}: {
  item: StrapiSliderAttributes;
  locale: string;
}) {
  const imgSrc = process.env.NEXT_PUBLIC_STRAPI_API_URL + item.image.data.attributes.url;

  const heading = getContent(
    locale,
    item.locale,
    item.heading,
    item.localizations.data[0]?.attributes.heading
  );

  const title = getContent(
    locale,
    item.locale,
    item.title,
    item.localizations.data[0]?.attributes.title
  );

  const description = getContent(
    locale,
    item.locale,
    item.description,
    item.localizations.data[0]?.attributes.description
  );

  const btnContent = getContent(
    locale,
    item.locale,
    item.btnContent,
    item.localizations.data[0]?.attributes.btnContent
  );

  return (
    <div
      className="flex h-[272px] w-full items-center justify-evenly px-6 sm:h-[634px]"
      style={{ backgroundColor: item.bgHexColor }}
    >
      <Image
        className={cn(
          `w-1/3 object-contain`,
          item.isLeft ? "order-1" : "order-2"
        )}
        src={imgSrc}
        width={1920}
        height={1200}
        alt={item.title || "carousel image"}
      />
      <div
        className={cn(
          `flex flex-col justify-center pb-10`,
          // item.isLeft ? "order-2 text-right" : "order-1 text-left"
          item.isLeft ? "order-2" : "order-1 text-left"
        )}
        style={{ color: item.textHexColor2 }}
      >
        <h1 className="font-fancy text-[16px] sm:text-[28px] md:text-[40px]">
          {heading}
        </h1>
        <h2
          className="text-[16px] font-bold uppercase sm:text-[30px] md:text-[60px]"
          style={{ color: item.textHexColor1 }}
        >
          {title}
        </h2>
        <h5 className="text-balance max-w-[200px] text-[9px] font-normal sm:max-w-[270px] sm:text-[14px] md:max-w-lg md:text-[18px]">
          {description}
        </h5>
        <Link
          href={item.href || "/shop"}
          className={cn(
            `mt-4 w-fit px-2 py-2 text-[12px] font-bold uppercase sm:py-5 sm:px-11`,
            // item.isLeft && "ml-auto"
          )}
          style={{ backgroundColor: item.btnColor, color: item.btnTextColor }}
        >
          {btnContent}
        </Link>
      </div>
    </div>
  );
};
