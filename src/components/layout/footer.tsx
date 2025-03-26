import { Footer as FBFooter, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";
import {SITE_DATA} from "@/metadata/site-data";
import {fetchFooterPages} from "@/libs/strapi-rest-api";

export default async function Footer() {
  const footerPagesData = await fetchFooterPages()

  const footerPages = footerPagesData.data.data
    .filter(i => !['payment-error', 'payment-success'].includes(i.attributes.slug))

  return (
    <>
      <div className="border-t-2 rounded-none border-gray-300" />
      <FBFooter className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 shadow-none">
        <div className="w-full">
          <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
            <div>
              <FooterLinkGroup col>
                <FooterLink href={SITE_DATA.instagram} className="underline-offset-4">Instagram</FooterLink>
                <FooterLink href={SITE_DATA.whatsapp} className="underline-offset-4">Whatsapp</FooterLink>
                <FooterLink href={SITE_DATA.vk} className="underline-offset-4">VKontakte</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterLinkGroup col>
                {footerPages.map(i => (
                  <FooterLink key={i.id} href={`/info/${i.attributes.slug}`} className="underline-offset-4">
                    {i.attributes.name}
                  </FooterLink>
                ))}
              </FooterLinkGroup>
            </div>
          </div>
          <div className="w-full px-4 py-6 sm:flex sm:items-center sm:justify-between text-sm text-gray-500 dark:text-gray-400 sm:text-center">
            since 2014 REDCROW
          </div>
        </div>
      </FBFooter>
    </>
  );
}
