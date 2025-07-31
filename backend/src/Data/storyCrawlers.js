// const axios = require('axios'); // Thư viện gửi HTTP request
// const cheerio = require('cheerio'); // Thư viện xử lý HTML
// const pLimit = require('p-limit'); // Thư viện giới hạn số lượng yêu cầu đồng thời

// // Giới hạn số lượng yêu cầu đồng thời
// const limit = pLimit(5); // Giới hạn 5 yêu cầu đồng thời

// // Hàm lấy HTML từ URL
// async function getHTML(url) {
//     try {
//         const { data: html } = await axios.get(url);
//         return html;
//     } catch (error) {
//         console.error("Error fetching HTML:", error.message);
//         return null;
//     }
// }

// /**
//  * Factory function to create a crawler for a specific story category.
//  * @param {string} nameType - The category slug for the URL (e.g., 'truyen-tien-hiep').
//  * @param {number} maxPages - The maximum number of pages to crawl.
//  * @param {boolean} isCompleted - Whether the story category is for completed stories (affects URL structure).
//  * @returns {function(): Promise<Array<object>>} An async function that starts the crawling process.
//  */
// const createCrawlFunction = (nameType, maxPages, isCompleted = true) => {
//     return async () => {
//         const baseUrl = 'https://truyenhoan.com/';
//         // Construct the URL based on whether the stories are completed
//         const url = isCompleted ? `${baseUrl}${nameType}/hoan/` : `${baseUrl}${nameType}/`;

//         const storyData = [];
//         const urlsToCrawl = [];
//         for (let i = 1; i <= maxPages; i++) {
//             const pageUrl = i === 1 ? url : `${url}trang-${i}/`;
//             urlsToCrawl.push(pageUrl);
//         }

//         const crawlTasks = urlsToCrawl.map(pageUrl => limit(() => getHTML(pageUrl)));
//         const htmls = await Promise.all(crawlTasks);

//         htmls.forEach((html, index) => {
//             if (!html) {
//                 console.error(`Failed to fetch HTML content for page ${index + 1} of ${nameType}.`);
//                 return;
//             }

//             const $ = cheerio.load(html);

//             $('.row').each((i, element) => {
//                 const imageLinks = $(element).find('.col-list-image > div').children('div').eq(0).attr('data-desk-image');
//                 const title = $(element).find('.truyen-title').text().trim();
//                 const linkComic = $(element).find('.truyen-title a').attr('href');
//                 const author = $(element).find('.glyphicon-pencil').parent().text().trim();
//                 const chapters = $(element).find('.glyphicon-list').parent().text().trim();

//                 if (title) {
//                     storyData.push({
//                         Title: title || 'N/A',
//                         Author: author || 'Unknown',
//                         LinkComic: linkComic || 'N/A',
//                         Chapters: chapters || '0 chương',
//                         ImageLinks: imageLinks || 'N/A',
//                     });
//                 }
//             });
//         });

//         if (storyData.length === 0) {
//             console.error(`No data found for ${nameType}. Please check the URL structure.`);
//         }

//         return storyData;
//     };
// };

// // Configuration for all crawlers
// const crawlerConfigs = [
//     { name: 'CrawlTruyenTienHiep', type: 'truyen-tien-hiep', pages: 70, completed: true },
//     { name: 'CrawlTruyenKiemHiep', type: 'truyen-kiem-hiep', pages: 61, completed: true },
//     { name: 'CrawlTruyenHoanHot', type: 'truyen-hot-hoan-thanh', pages: 10, completed: true },
//     { name: 'CrawlTruyenHot', type: 'truyen-hot', pages: 10, completed: false },
//     { name: 'CrawlTruyenMoiCapNhat', type: 'moi-cap-nhat', pages: 20, completed: false },
// ];

// const exportedCrawlers = {};
// crawlerConfigs.forEach(config => {
//     exportedCrawlers[config.name] = createCrawlFunction(config.type, config.pages, config.completed);
// });

// // Export all configured crawlers
// module.exports = exportedCrawlers;