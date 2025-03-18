# Redcrow React
### Tехнические детали:
Wordpress:  кастомный под фильтры: https://github.com/thedogrex/redcrow-wp
NodeJS:  v18.18.0.
WooCommerce - интеграция с 1С
Email письма: Mailgiun сервис

React приложение использует wp-api json для получения необходимых данных.

Все необходимые ключи интеграции настраиваются в env файле.

Кастомные страницы: вёрстка находится в разделе Posts в Wordpress.

Ссылки:
Strapi админка: https://api.redcrow.kz/admin/auth/login
Wordpress Админка: https://admin.redcrow.kz/wp-admin/

# Для старта проекта:
npm install
npm run dev (для проверки запуска в консоли)

### для production запуска:
npm run build

и далее управление процессом через pm2