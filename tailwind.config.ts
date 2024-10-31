import type { Config } from "tailwindcss";

import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      aspectRatio: {
        '3/4': '3 / 4',
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
export default config;
