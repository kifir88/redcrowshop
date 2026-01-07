

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "@/app/providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { ThemeModeScript } from "flowbite-react";
import { SITE_DATA } from "@/metadata/site-data";

import "./globals.css";
import FullscreenModal from "@/components/fullscreen_modal";
import Script from "next/script";

const roboto = Roboto({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "700", "900"]
});

export const metadata: Metadata = {
  title: SITE_DATA.head_title_home,
  description: SITE_DATA.desc_home,
};

const YM_ID = '106161769';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*--<Script src="./cdek.js" strategy="beforeInteractive" />-->*/}
        <ThemeModeScript />
      </head>
      <body className={roboto.className}>
        <Providers>
          <main>
            <Navbar />
            {children}
            <Footer />
            {/*<FullscreenModal />*/}
          </main>
        </Providers>
        {/* Яндекс Метрика */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
               (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106161769', 'ym');

        ym(106161769, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});

          `}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/{YM_ID}`}
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>

      </body>
    </html>
  );
}
