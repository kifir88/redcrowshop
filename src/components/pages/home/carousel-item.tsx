import {cn} from "@/libs/utils";
import Link from "next/link";

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
  em,
  locale,
}: {
  em: Attributes;
  locale: string;
}) {
  const imgSrc = process.env.NEXT_PUBLIC_STRAPI_API_URL + em.image.data.attributes.url;

  const heading = getContent(
    locale,
    em.locale,
    em.heading,
    em.localizations.data[0]?.attributes.heading
  );

  const title = getContent(
    locale,
    em.locale,
    em.title,
    em.localizations.data[0]?.attributes.title
  );

  const description = getContent(
    locale,
    em.locale,
    em.description,
    em.localizations.data[0]?.attributes.description
  );

  const btnContent = getContent(
    locale,
    em.locale,
    em.btnContent,
    em.localizations.data[0]?.attributes.btnContent
  );

  return (
    <div
      className="flex h-[272px] w-full items-center justify-evenly px-6 sm:h-[634px]"
      style={{ backgroundColor: em.bgHexColor }}
    >
      <img
        className={cn(
          `w-1/3 object-contain`,
          em.isLeft ? "order-1" : "order-2"
        )}
        src={imgSrc}
        width={1920}
        height={1200}
        alt={em.title || "carousel image"}
      />
      <div
        className={`flex flex-col justify-center pb-10 ${
          em.isLeft ? "order-2 text-right" : "order-1 text-left"
        }`}
        style={{ color: em.textHexColor2 }}
      >
        <h1 className="font-fancy text-[16px] sm:text-[28px] md:text-[40px]">
          {heading}
        </h1>
        <h2
          className="text-[16px] font-bold uppercase sm:text-[30px] md:text-[60px]"
          style={{ color: em.textHexColor1 }}
        >
          {title}
        </h2>
        <h5 className="max-w-[200px] text-[9px] font-normal sm:max-w-[270px] sm:text-[14px] md:max-w-lg md:text-[18px]">
          {description}
        </h5>
        <Link
          href={em.href || "/shop"}
          className={cn(
            `w-fit px-2 py-2 text-[12px] font-bold uppercase sm:py-5 sm:px-11`,
            em.isLeft && "ml-auto"
          )}
          style={{ backgroundColor: em.btnColor, color: em.btnTextColor }}
        >
          {btnContent}
        </Link>
      </div>
    </div>
  );
};
