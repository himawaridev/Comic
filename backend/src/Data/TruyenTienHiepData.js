const axios = require('axios'); // Thư viện gửi HTTP request
const cheerio = require('cheerio'); // Thư viện xử lý HTML
const pLimit = require('p-limit'); // Thư viện giới hạn số lượng yêu cầu đồng thời

// Khai báo URL
const url = 'https://truyenhoan.com/truyen-kiem-hiep/hoan/';

// Giới hạn số lượng yêu cầu đồng thời
const limit = pLimit(5); // Giới hạn 5 yêu cầu đồng thời

// Hàm lấy HTML từ URL
async function getHTML(url) {
    try {
        const { data: html } = await axios.get(url);
        return html;
    } catch (error) {
        console.error("Error fetching HTML:", error.message);
        return null;
    }
}

// Hàm crawl dữ liệu
const CrawlTruyenTienHiep = async () => {
    const TruyenTienHiepData = []; // Tạo mảng rỗng để chứa dữ liệu

    // Tạo mảng chứa các URL cần crawl
    const UrlData = [];
    for (let i = 1; i <= 70; i++) { // Crawl 61 trang
        const UrlTrang = i === 1 ? url : `${url}trang-${i}/`;
        UrlData.push(UrlTrang);
    }

    // Sử dụng p-limit để giới hạn số lượng yêu cầu đồng thời
    const crawlTasks = UrlData.map(url => limit(() => getHTML(url)));
    const htmls = await Promise.all(crawlTasks);

    // Duyệt qua từng trang
    htmls.forEach((html, index) => {
        if (!html) {
            console.error(`[❌ Fetch HTML] Failed to Fetch HTML content for page ${index + 1}.`);
            return;
        }

        const $ = cheerio.load(html);

        // Duyệt qua từng phần tử .row
        $('.row').each((i, element) => {

            // ImageLinks: Lấy link ảnh:
            const ImageLinks = $(element).find('.col-list-image > div').children('div').eq(0).attr('data-desk-image');

            // Title: Lấy tiêu đề truyện:
            const Title = $(element).find('.truyen-title').text().trim();

            // LinkComic: Lấy link truyện dùng để crawl:
            const LinkComic = $(element).find('.truyen-title a').attr('href');

            // Author: Lấy tên tác giả:
            const Author = $(element).find('.glyphicon-pencil').parent().text().trim();

            // Chapters: Lấy số chương:
            const Chapters = $(element).find('.glyphicon-list').parent().text().trim();

            // Chỉ thêm vào mảng nếu có tiêu đề:
            if (Title) {
                TruyenTienHiepData.push({
                    Title: Title || 'Undefined Title', // Tiêu đề truyện
                    Author: Author || 'Undefined Author', // Tên tác giả
                    LinkComic: LinkComic || 'Undefined LinkComic', // Link truyện dùng để crawl
                    Chapters: Chapters || 'Undefined Chapters', // Số chương
                    ImageLinks: ImageLinks || 'Undefined ImageLinks', // Liên kết ảnh cho từng truyện
                });
            }
        });
    });

    // Kiểm tra kết quả
    if (TruyenTienHiepData.length === 0) {
        console.error("[❌ No data] Check the URL structure: Data/TruyenTienHiepData.js");
        return [];
    }

    // UnLock this line to see the data:
    // console.log("[TruyenTienHiepData.js]", TruyenTienHiepData);

    return TruyenTienHiepData;
};

// Xuất module
module.exports = {
    CrawlTruyenTienHiep,
};