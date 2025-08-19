const axios = require('axios');
const cheerio = require('cheerio');
const pLimit = require('p-limit');

const Domain = 'https://truyenhoan.com/';

const TRUYEN_CONFIGS = {
    // Các loại truyện cơ bản đã có
    'truyen-hot': {
        name: 'TruyenHot',
        url: `${Domain}truyen-hot/`,
        selector: '.row',
        pages: 70
    },
    'truyen-kiem-hiep': {
        name: 'TruyenKiemHiep',
        url: `${Domain}truyen-kiem-hiep/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-tien-hiep': {
        name: 'TruyenTienHiep',
        url: `${Domain}truyen-tien-hiep/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-moi-cap-nhat': {
        name: 'TruyenMoiCapNhat',
        url: `${Domain}truyen-moi-cap-nhat/`,
        selector: '.row',
        pages: 70
    },

    // Thêm các thể loại mới
    'truyen-ngon-tinh': {
        name: 'TruyenNgonTinh',
        url: `${Domain}truyen-ngon-tinh/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-quan-truong': {
        name: 'TruyenQuanTruong',
        url: `${Domain}truyen-quan-truong/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-xuyen-khong': {
        name: 'TruyenXuyenKhong',
        url: `${Domain}truyen-xuyen-khong/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-trinh-tham': {
        name: 'TruyenTrinhTham',
        url: `${Domain}truyen-trinh-tham/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-tham-hiem': {
        name: 'TruyenThamHiem',
        url: `${Domain}truyen-tham-hiem/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-linh-di': {
        name: 'TruyenLinhDi',
        url: `${Domain}truyen-linh-di/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-nguoc': {
        name: 'TruyenNguoc',
        url: `${Domain}truyen-nguoc/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-sung': {
        name: 'TruyenSung',
        url: `${Domain}truyen-sung/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-cung-dau': {
        name: 'TruyenCungDau',
        url: `${Domain}truyen-cung-dau/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-nu-cuong': {
        name: 'TruyenNuCuong',
        url: `${Domain}truyen-nu-cuong/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-dong-phuong': {
        name: 'TruyenDongPhuong',
        url: `${Domain}truyen-dong-phuong/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-dam-my': {
        name: 'TruyenDamMy',
        url: `${Domain}truyen-dam-my/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-bach-hop': {
        name: 'TruyenBachHop',
        url: `${Domain}truyen-bach-hop/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-hai-huoc': {
        name: 'TruyenHaiHuoc',
        url: `${Domain}truyen-hai-huoc/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-co-dai': {
        name: 'TruyenCoDai',
        url: `${Domain}truyen-co-dai/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-mat-the': {
        name: 'TruyenMatThe',
        url: `${Domain}truyen-mat-the/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-tieu-thuyet': {
        name: 'TruyenTieuThuyet',
        url: `${Domain}truyen-tieu-thuyet/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-khac': {
        name: 'TruyenKhac',
        url: `${Domain}truyen-khac/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-vong-du': {
        name: 'TruyenVongDu',
        url: `${Domain}truyen-vong-du/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-khoa-huyen': {
        name: 'TruyenKhoaHuyen',
        url: `${Domain}truyen-khoa-huyen/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-di-nang': {
        name: 'TruyenDiNang',
        url: `${Domain}truyen-di-nang/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-huyen-huyen': {
        name: 'TruyenHuyenHuyen',
        url: `${Domain}truyen-huyen-huyen/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-trong-sinh': {
        name: 'TruyenTrongSinh',
        url: `${Domain}truyen-trong-sinh/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-do-thi': {
        name: 'TruyenDoThi',
        url: `${Domain}truyen-do-thi/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-di-gioi': {
        name: 'TruyenDiGioi',
        url: `${Domain}truyen-di-gioi/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-gia-dau': {
        name: 'TruyenGiaDau',
        url: `${Domain}truyen-gia-dau/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-dien-van': {
        name: 'TruyenDienVan',
        url: `${Domain}truyen-dien-van/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-nu-phu': {
        name: 'TruyenNuPhu',
        url: `${Domain}truyen-nu-phu/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-quan-su': {
        name: 'TruyenQuanSu',
        url: `${Domain}truyen-quan-su/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-lich-su': {
        name: 'TruyenLichSu',
        url: `${Domain}truyen-lich-su/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-teen': {
        name: 'TruyenTeen',
        url: `${Domain}truyen-teen/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-light-novel': {
        name: 'TruyenLightNovel',
        url: `${Domain}truyen-light-novel/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-da-su': {
        name: 'TruyenDaSu',
        url: `${Domain}truyen-da-su/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-doan-van': {
        name: 'TruyenDoanVan',
        url: `${Domain}truyen-doan-van/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-phuong-tay': {
        name: 'TruyenPhuongTay',
        url: `${Domain}truyen-phuong-tay/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-viet-nam': {
        name: 'TruyenVietNam',
        url: `${Domain}truyen-viet-nam/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-he-thong': {
        name: 'TruyenHeThong',
        url: `${Domain}truyen-he-thong/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-xuyen-nhanh': {
        name: 'TruyenXuyenNhanh',
        url: `${Domain}truyen-xuyen-nhanh/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-hien-dai': {
        name: 'TruyenHienDai',
        url: `${Domain}truyen-hien-dai/hoan/`,
        selector: '.row',
        pages: 70
    },
    'truyen-tong-tai': {
        name: 'TruyenTongTai',
        url: `${Domain}truyen-tong-tai/hoan/`,
        selector: '.row',
        pages: 70
    }
};

// Giới hạn số lượng yêu cầu đồng thời
const limit = pLimit(5);

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

// Hàm crawl nội dung chi tiết của một truyện
const crawlTruyenContentData = async (linkComic) => {
    try {
        // Nếu LinkComic là relative URL, thêm domain
        const fullUrl = linkComic.startsWith('http') ? linkComic : `${Domain}${linkComic.replace(/^\//, '')}`;

        const html = await getHTML(fullUrl);
        if (!html) {
            console.error(`Failed to fetch HTML content for: ${fullUrl}`);
            return null;
        }

        const $ = cheerio.load(html);

        // Lấy thông tin chi tiết
        const ImageLinks = $('.book img').attr('src') || 'N/A';
        const NameComic = $('.title').text().trim() || 'N/A';
        const Rating = $('span[itemprop="ratingValue"]').text().trim() || 'N/A';
        const RatingCount = $('span[itemprop="ratingCount"]').text().trim() || 'N/A';
        const Description = $('.desc-text').text().trim() || 'N/A';
        const Author = $('.info a[itemprop="author"]').text().trim() || 'N/A';

        // Lấy thể loại
        const Genres = [];
        $('div h3:contains("Thể loại")').nextAll('a').map((i, element) => {
            const Link = $(element).attr('href');
            const Text = $(element).text().trim();
            if (Link && Text) {
                Genres.push({ Link, Text });
            }
        });

        // Lấy trạng thái
        const Status = $('.info .text-primary').text().trim() || $('.info .text-success').text().trim() || 'N/A';

        // Lấy tags
        const Tags = [];
        $('div h3:contains("Tags")').nextAll('a').map((i, element) => {
            const Link = $(element).attr('href');
            const Text = $(element).text().trim();
            if (Link && Text) {
                Tags.push({ Link, Text });
            }
        });

        // Lấy danh sách chương
        const Chapters = [];
        $('.list-chapter li a').each((i, element) => {
            const Link = $(element).attr('href');
            const Text = $(element).find('.chapter-text span').text().trim();
            const Number = $(element).text().replace(Text, '').trim();
            const ConcatLink = Text.concat(' ', Number);

            if (Link && Text) {
                Chapters.push({ Link, ConcatLink });
            }
        });

        return {
            ImageLinks,
            NameComic,
            Rating,
            RatingCount,
            Description,
            Author,
            Genres,
            Status,
            Tags,
            Chapters,
            LinkComic: linkComic
        };

    } catch (error) {
        console.error(`Error crawling content for ${linkComic}:`, error.message);
        return null;
    }
};

// Hàm crawl dữ liệu chung
const crawlTruyenData = async (type, includeContent = false) => {
    const config = TRUYEN_CONFIGS[type];
    if (!config) {
        throw new Error(`Unknown type: ${type}`);
    }

    const truyenData = []; // Tạo mảng rỗng để chứa dữ liệu

    // Tạo mảng chứa các URL cần crawl
    const UrlData = [];
    for (let i = 1; i <= config.pages; i++) {
        const UrlTrang = i === 1 ? config.url : `${config.url}trang-${i}/`;
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

        // Duyệt qua từng phần tử theo selector
        $(config.selector).each((i, element) => {
            // ImageLinks: Lấy link ảnh
            const ImageLinks = $(element).find('.col-list-image > div').children('div').eq(0).attr('data-desk-image');

            // Title: Lấy tiêu đề truyện
            const Title = $(element).find('.truyen-title').text().trim();

            // LinkComic: Lấy link truyện dùng để crawl
            const LinkComic = $(element).find('.truyen-title a').attr('href');

            // Author: Lấy tên tác giả
            const Author = $(element).find('.glyphicon-pencil').parent().text().trim();

            // Chapters: Lấy số chương
            const Chapters = $(element).find('.glyphicon-list').parent().text().trim();

            // Chỉ thêm vào mảng nếu có tiêu đề
            if (Title) {
                truyenData.push({
                    Title: Title || 'Undefined Title',
                    Author: Author || 'Undefined Author',
                    LinkComic: LinkComic || 'Undefined LinkComic',
                    Chapters: Chapters || 'Undefined Chapters',
                    ImageLinks: ImageLinks || 'Undefined ImageLinks',
                });
            }
        });
    });

    // Kiểm tra kết quả
    if (truyenData.length === 0) {
        console.error(`[❌ No data] Check the URL structure: ${config.name}`);
        return [];
    }

    // Nếu yêu cầu crawl nội dung chi tiết
    if (includeContent) {
        console.log(`[🔄 Crawling content] Đang crawl nội dung chi tiết cho ${truyenData.length} truyện...`);

        // Crawl nội dung chi tiết cho từng truyện (giới hạn 3 requests đồng thời để tránh quá tải)
        const contentLimit = pLimit(3);
        const contentTasks = truyenData.map(truyen =>
            contentLimit(() => crawlTruyenContentDataData(truyen.LinkComic))
        );

        const contents = await Promise.all(contentTasks);

        // Gộp thông tin cơ bản với nội dung chi tiết
        truyenData.forEach((truyen, index) => {
            if (contents[index]) {
                Object.assign(truyen, contents[index]);
            }
        });

        console.log(`[✅ Content crawled] Đã crawl xong nội dung chi tiết!`);
    }

    // UnLock this line to see the data:
    // console.log(`[${config.name}]`, Object.entries(truyenData).slice(0, 1));

    return truyenData;
};

module.exports = {
    // Crawl danh sách truyện cơ bản
    CrawlTruyenHot: () => crawlTruyenData('truyen-hot'),
    CrawlTruyenMoiCapNhat: () => crawlTruyenData('truyen-moi-cap-nhat'),
    CrawlTruyenFull: () => crawlTruyenData('truyen-full'),
    CrawlTruyenKiemHiep: () => crawlTruyenData('truyen-kiem-hiep'),
    CrawlTruyenTienHiep: () => crawlTruyenData('truyen-tien-hiep'),
    CrawlTruyenNgonTinh: () => crawlTruyenData('truyen-ngon-tinh'),
    CrawlTruyenQuanTruong: () => crawlTruyenData('truyen-quan-truong'),
    CrawlTruyenXuyenKhong: () => crawlTruyenData('truyen-xuyen-khong'),
    CrawlTruyenTrinhTham: () => crawlTruyenData('truyen-trinh-tham'),
    CrawlTruyenThamHiem: () => crawlTruyenData('truyen-tham-hiem'),
    CrawlTruyenLinhDi: () => crawlTruyenData('truyen-linh-di'),
    CrawlTruyenNguoc: () => crawlTruyenData('truyen-nguoc'),
    CrawlTruyenSung: () => crawlTruyenData('truyen-sung'),
    CrawlTruyenCungDau: () => crawlTruyenData('truyen-cung-dau'),
    CrawlTruyenNuCuong: () => crawlTruyenData('truyen-nu-cuong'),
    CrawlTruyenDongPhuong: () => crawlTruyenData('truyen-dong-phuong'),
    CrawlTruyenDamMy: () => crawlTruyenData('truyen-dam-my'),
    CrawlTruyenBachHop: () => crawlTruyenData('truyen-bach-hop'),
    CrawlTruyenHaiHuoc: () => crawlTruyenData('truyen-hai-huoc'),
    CrawlTruyenCoDai: () => crawlTruyenData('truyen-co-dai'),
    CrawlTruyenMatThe: () => crawlTruyenData('truyen-mat-the'),
    CrawlTruyenTieuThuyet: () => crawlTruyenData('truyen-tieu-thuyet'),
    CrawlTruyenKhac: () => crawlTruyenData('truyen-khac'),
    CrawlTruyenVongDu: () => crawlTruyenData('truyen-vong-du'),
    CrawlTruyenKhoaHuyen: () => crawlTruyenData('truyen-khoa-huyen'),
    CrawlTruyenDiNang: () => crawlTruyenData('truyen-di-nang'),
    CrawlTruyenHuyenHuyen: () => crawlTruyenData('truyen-huyen-huyen'),
    CrawlTruyenTrongSinh: () => crawlTruyenData('truyen-trong-sinh'),
    CrawlTruyenDoThi: () => crawlTruyenData('truyen-do-thi'),
    CrawlTruyenDiGioi: () => crawlTruyenData('truyen-di-gioi'),
    CrawlTruyenGiaDau: () => crawlTruyenData('truyen-gia-dau'),
    CrawlTruyenDienVan: () => crawlTruyenData('truyen-dien-van'),
    CrawlTruyenNuPhu: () => crawlTruyenData('truyen-nu-phu'),
    CrawlTruyenQuanSu: () => crawlTruyenData('truyen-quan-su'),
    CrawlTruyenLichSu: () => crawlTruyenData('truyen-lich-su'),
    CrawlTruyenTeen: () => crawlTruyenData('truyen-teen'),
    CrawlTruyenLightNovel: () => crawlTruyenData('truyen-light-novel'),
    CrawlTruyenDaSu: () => crawlTruyenData('truyen-da-su'),
    CrawlTruyenDoanVan: () => crawlTruyenData('truyen-doan-van'),
    CrawlTruyenPhuongTay: () => crawlTruyenData('truyen-phuong-tay'),
    CrawlTruyenVietNam: () => crawlTruyenData('truyen-viet-nam'),
    CrawlTruyenHeThong: () => crawlTruyenData('truyen-he-thong'),
    CrawlTruyenXuyenNhanh: () => crawlTruyenData('truyen-xuyen-nhanh'),
    CrawlTruyenHienDai: () => crawlTruyenData('truyen-hien-dai'),
    CrawlTruyenTongTai: () => crawlTruyenData('truyen-tong-tai'),

    // Crawl danh sách truyện + nội dung chi tiết
    CrawlTruyenHotWithContent: () => crawlTruyenData('truyen-hot', true),
    CrawlTruyenMoiCapNhatWithContent: () => crawlTruyenData('truyen-moi-cap-nhat', true),
    CrawlTruyenFullWithContent: () => crawlTruyenData('truyen-full', true),
    CrawlTruyenKiemHiepWithContent: () => crawlTruyenData('truyen-kiem-hiep', true),
    CrawlTruyenTienHiepWithContent: () => crawlTruyenData('truyen-tien-hiep', true),
    CrawlTruyenNgonTinhWithContent: () => crawlTruyenData('truyen-ngon-tinh', true),
    CrawlTruyenQuanTruongWithContent: () => crawlTruyenData('truyen-quan-truong', true),
    CrawlTruyenXuyenKhongWithContent: () => crawlTruyenData('truyen-xuyen-khong', true),
    CrawlTruyenTrinhThamWithContent: () => crawlTruyenData('truyen-trinh-tham', true),
    CrawlTruyenThamHiemWithContent: () => crawlTruyenData('truyen-tham-hiem', true),
    CrawlTruyenLinhDiWithContent: () => crawlTruyenData('truyen-linh-di', true),
    CrawlTruyenNguocWithContent: () => crawlTruyenData('truyen-nguoc', true),
    CrawlTruyenSungWithContent: () => crawlTruyenData('truyen-sung', true),
    CrawlTruyenCungDauWithContent: () => crawlTruyenData('truyen-cung-dau', true),
    CrawlTruyenNuCuongWithContent: () => crawlTruyenData('truyen-nu-cuong', true),
    CrawlTruyenDongPhuongWithContent: () => crawlTruyenData('truyen-dong-phuong', true),
    CrawlTruyenDamMyWithContent: () => crawlTruyenData('truyen-dam-my', true),
    CrawlTruyenBachHopWithContent: () => crawlTruyenData('truyen-bach-hop', true),
    CrawlTruyenHaiHuocWithContent: () => crawlTruyenData('truyen-hai-huoc', true),
    CrawlTruyenCoDaiWithContent: () => crawlTruyenData('truyen-co-dai', true),
    CrawlTruyenMatTheWithContent: () => crawlTruyenData('truyen-mat-the', true),
    CrawlTruyenTieuThuyetWithContent: () => crawlTruyenData('truyen-tieu-thuyet', true),
    CrawlTruyenKhacWithContent: () => crawlTruyenData('truyen-khac', true),
    CrawlTruyenVongDuWithContent: () => crawlTruyenData('truyen-vong-du', true),
    CrawlTruyenKhoaHuyenWithContent: () => crawlTruyenData('truyen-khoa-huyen', true),
    CrawlTruyenDiNangWithContent: () => crawlTruyenData('truyen-di-nang', true),
    CrawlTruyenHuyenHuyenWithContent: () => crawlTruyenData('truyen-huyen-huyen', true),
    CrawlTruyenTrongSinhWithContent: () => crawlTruyenData('truyen-trong-sinh', true),
    CrawlTruyenDoThiWithContent: () => crawlTruyenData('truyen-do-thi', true),
    CrawlTruyenDiGioiWithContent: () => crawlTruyenData('truyen-di-gioi', true),
    CrawlTruyenGiaDauWithContent: () => crawlTruyenData('truyen-gia-dau', true),
    CrawlTruyenDienVanWithContent: () => crawlTruyenData('truyen-dien-van', true),
    CrawlTruyenNuPhuWithContent: () => crawlTruyenData('truyen-nu-phu', true),
    CrawlTruyenQuanSuWithContent: () => crawlTruyenData('truyen-quan-su', true),
    CrawlTruyenLichSuWithContent: () => crawlTruyenData('truyen-lich-su', true),
    CrawlTruyenTeenWithContent: () => crawlTruyenData('truyen-teen', true),
    CrawlTruyenLightNovelWithContent: () => crawlTruyenData('truyen-light-novel', true),
    CrawlTruyenDaSuWithContent: () => crawlTruyenData('truyen-da-su', true),
    CrawlTruyenDoanVanWithContent: () => crawlTruyenData('truyen-doan-van', true),
    CrawlTruyenPhuongTayWithContent: () => crawlTruyenData('truyen-phuong-tay', true),
    CrawlTruyenVietNamWithContent: () => crawlTruyenData('truyen-viet-nam', true),
    CrawlTruyenHeThongWithContent: () => crawlTruyenData('truyen-he-thong', true),
    CrawlTruyenXuyenNhanhWithContent: () => crawlTruyenData('truyen-xuyen-nhanh', true),
    CrawlTruyenHienDaiWithContent: () => crawlTruyenData('truyen-hien-dai', true),
    CrawlTruyenTongTaiWithContent: () => crawlTruyenData('truyen-tong-tai', true),

    // Crawl nội dung chi tiết của một truyện cụ thể
    crawlTruyenContentData: crawlTruyenContentData,

    // Utility function để lấy danh sách tất cả thể loại
    getAllTruyenTypes: () => Object.keys(TRUYEN_CONFIGS),

    // Utility function để crawl tất cả thể loại cùng lúc
    CrawlAllTruyenTypes: async (includeContent = false) => {
        const allTypes = Object.keys(TRUYEN_CONFIGS);
        const results = {};

        for (const type of allTypes) {
            try {
                console.log(`[🔄] Đang crawl ${TRUYEN_CONFIGS[type].name}...`);
                results[type] = await crawlTruyenData(type, includeContent);
                console.log(`[✅] ${TRUYEN_CONFIGS[type].name}: ${results[type].length} truyện`);
            } catch (error) {
                console.error(`[❌] Lỗi khi crawl ${type}:`, error.message);
                results[type] = [];
            }
        }

        return results;
    }
};