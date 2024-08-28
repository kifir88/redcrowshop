import { Footer as FBFooter, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";
import {SITE_DATA} from "@/metadata/site-data";
import {fetchFooterPages} from "@/libs/strapi-rest-api";

export default async function Footer() {
  const footerPagesData = await fetchFooterPages()

  return (
    <>
      <div className="border-t-2 rounded-none border-gray-300" />
      <FBFooter className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 shadow-none">
        <div className="w-full">
          <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
            <div>
              <FooterLinkGroup col>
                <FooterLink href={SITE_DATA.instagram}>Instagram</FooterLink>
                <FooterLink href={SITE_DATA.whatsapp}>Whatsapp</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterLinkGroup col>
                {footerPagesData.data.data.map(i => (
                  <FooterLink key={i.id} href={`/info/${i.attributes.slug}`}>
                    {i.attributes.name}
                  </FooterLink>
                ))}
              </FooterLinkGroup>
            </div>
          </div>
          <div className="w-full px-4 py-6 sm:flex sm:items-center sm:justify-between">
            <FooterCopyright by="RedCrow™" year={new Date().getFullYear()} />
          </div>
        </div>
      </FBFooter>
    </>
  );
}
