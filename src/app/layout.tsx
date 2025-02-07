import type { Metadata } from "next";
import {Roboto} from "next/font/google";
import Providers from "@/app/providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {ThemeModeScript} from "flowbite-react";
import {SITE_DATA} from "@/metadata/site-data";

import "./globals.css";
import FullscreenModal from "@/components/fullscreen_modal";

const roboto = Roboto({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "700", "900"]
});

export const metadata: Metadata = {
  title: SITE_DATA.head_title_home,
  description: SITE_DATA.desc_home,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className={roboto.className}>
        <Providers>
          <main>
            <Navbar />
            {children}
            <Footer />
            <FullscreenModal />
          </main>
        </Providers>
      </body>
    </html>
  );
}
