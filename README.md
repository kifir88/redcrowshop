This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


TODO:

~~0) Убрать прыгание товаров при выборе фильтром или поиска по тексту.~~
~~1) Сместить меню влево, поменять шрифт как в оригинале (размер)~~
~~2) Добавить хардкодом кнопку "Магазин"~~
~~3) Поменять порядок вывода меняю задом на перед.~~
~~4) Смена валюты. (Любым костыльным способом через константы)~~
5) Убрать драг в слайдере
~~6) Добавить страницу "Магазин" - содержит в себе все категории на уровне Аксессуаров и Одежды (могут добавляться другие)~~
~~7) Строка фильтра по нажатию enter чтобы не сбрасывалась.~~
8) Фильтры с зареджкой в 1.5 секунды
~~9) Popup при добавлении товара в корзину (внизу сообщение мелкое)~~
~~10) Кнопка Заказать с 0 товаров - не должна открывать меню оплаты.~~
11) sitemap.xml - формировался в каком либо виде по страницам.
~~12) Сделать фильтры в query параметрах slug с разделителем -or- вместо запятых пример:
    http://redcrow.kz/category/odezhda?model=mini&razmer=M-or-L-or-S&tsvet=jeltiy~~
~~13) Фильтрация по цене. (Считывать max price с сервера)~~
~~14) (Моб версия) При нажатии на пункт меню в выборе категории товара меню должно закрываться. - но в фильтрах закрываться не должно.~~
~~15)  (Моб версия) При клике со страницы сайта "Перейти в корзину" - Popup корзины должен закрываться.~~