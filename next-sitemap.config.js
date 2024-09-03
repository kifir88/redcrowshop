/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: "https://www.redcrow.kz",
    generateRobotsTxt: true, // Generate a robots.txt
    sitemapSize: 7000, // Split sitemap into multiple files if you have many URLs
    autoLastmod: true, // Automatically append last modification date
};
