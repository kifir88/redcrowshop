import type { Metadata } from "next";
import {Roboto} from "next/font/google";
import Providers from "@/app/providers";
import Navbar from "@/components/layout/navbar";
import {ThemeModeScript} from "flowbite-react";

import "./globals.css";
import {SITE_DATA} from "@/metadata/site-data";

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
          </main>
        </Providers>
      </body>
    </html>
  );
}
