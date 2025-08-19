/**
 * TRUYEN SERVICES UNIFIED
 * File gộp duy nhất chứa tất cả các function service cho các thể loại truyện
 * Thay thế cho các file riêng biệt: TruyenHotServices.js, TruyenKiemHiepServices.js, v.v.
 */

// Import tất cả function crawl từ Data gộp
const {
    CrawlTruyenHot,
    CrawlTruyenKiemHiep,
    CrawlTruyenTienHiep,
    CrawlTruyenMoiCapNhat,
    CrawlTruyenNgonTinh,
    CrawlTruyenQuanTruong,
    CrawlTruyenXuyenKhong,
    CrawlTruyenTrinhTham,
    CrawlTruyenThamHiem,
    CrawlTruyenLinhDi,
    CrawlTruyenNguoc,
    CrawlTruyenSung,
    CrawlTruyenCungDau,
    CrawlTruyenNuCuong,
    CrawlTruyenDongPhuong,
    CrawlTruyenDamMy,
    CrawlTruyenBachHop,
    CrawlTruyenHaiHuoc,
    CrawlTruyenCoDai,
    CrawlTruyenMatThe,
    CrawlTruyenTieuThuyet,
    CrawlTruyenKhac,
    CrawlTruyenVongDu,
    CrawlTruyenKhoaHuyen,
    CrawlTruyenDiNang,
    CrawlTruyenHuyenHuyen,
    CrawlTruyenTrongSinh,
    CrawlTruyenDoThi,
    CrawlTruyenDiGioi,
    CrawlTruyenGiaDau,
    CrawlTruyenDienVan,
    CrawlTruyenNuPhu,
    CrawlTruyenQuanSu,
    CrawlTruyenLichSu,
    CrawlTruyenTeen,
    CrawlTruyenLightNovel,
    CrawlTruyenDaSu,
    CrawlTruyenDoanVan,
    CrawlTruyenPhuongTay,
    CrawlTruyenVietNam,
    CrawlTruyenHeThong,
    CrawlTruyenXuyenNhanh,
    CrawlTruyenHienDai,
    CrawlTruyenTongTai
} = require('../Data/TruyenCrawlerData');

// Import tất cả model từ Model
const {
    TruyenHot,
    TruyenKiemHiep,
    TruyenTienHiep,
    TruyenMoiCapNhat,
    TruyenNgonTinh,
    TruyenQuanTruong,
    TruyenXuyenKhong,
    TruyenTrinhTham,
    TruyenThamHiem,
    TruyenLinhDi,
    TruyenNguoc,
    TruyenSung,
    TruyenCungDau,
    TruyenNuCuong,
    TruyenDongPhuong,
    TruyenDamMy,
    TruyenBachHop,
    TruyenHaiHuoc,
    TruyenCoDai,
    TruyenMatThe,
    TruyenTieuThuyet,
    TruyenKhac,
    TruyenVongDu,
    TruyenKhoaHuyen,
    TruyenDiNang,
    TruyenHuyenHuyen,
    TruyenTrongSinh,
    TruyenDoThi,
    TruyenDiGioi,
    TruyenGiaDau,
    TruyenDienVan,
    TruyenNuPhu,
    TruyenQuanSu,
    TruyenLichSu,
    TruyenTeen,
    TruyenLightNovel,
    TruyenDaSu,
    TruyenDoanVan,
    TruyenPhuongTay,
    TruyenVietNam,
    TruyenHeThong,
    TruyenXuyenNhanh,
    TruyenHienDai,
    TruyenTongTai
} = require('../Model');

// Cấu hình mapping giữa crawl function và model
const TRUYEN_SERVICE_CONFIGS = {
    'truyen-hot': {
        crawlFunction: CrawlTruyenHot,
        model: TruyenHot,
        name: 'TruyenHot'
    },
    'truyen-kiem-hiep': {
        crawlFunction: CrawlTruyenKiemHiep,
        model: TruyenKiemHiep,
        name: 'TruyenKiemHiep'
    },
    'truyen-tien-hiep': {
        crawlFunction: CrawlTruyenTienHiep,
        model: TruyenTienHiep,
        name: 'TruyenTienHiep'
    },
    'truyen-moi-cap-nhat': {
        crawlFunction: CrawlTruyenMoiCapNhat,
        model: TruyenMoiCapNhat,
        name: 'TruyenMoiCapNhat'
    },
    'truyen-ngon-tinh': {
        crawlFunction: CrawlTruyenNgonTinh,
        model: TruyenNgonTinh,
        name: 'TruyenNgonTinh'
    },
    'truyen-quan-truong': {
        crawlFunction: CrawlTruyenQuanTruong,
        model: TruyenQuanTruong,
        name: 'TruyenQuanTruong'
    },
    'truyen-xuyen-khong': {
        crawlFunction: CrawlTruyenXuyenKhong,
        model: TruyenXuyenKhong,
        name: 'TruyenXuyenKhong'
    },
    'truyen-trinh-tham': {
        crawlFunction: CrawlTruyenTrinhTham,
        model: TruyenTrinhTham,
        name: 'TruyenTrinhTham'
    },
    'truyen-tham-hiem': {
        crawlFunction: CrawlTruyenThamHiem,
        model: TruyenThamHiem,
        name: 'TruyenThamHiem'
    },
    'truyen-linh-di': {
        crawlFunction: CrawlTruyenLinhDi,
        model: TruyenLinhDi,
        name: 'TruyenLinhDi'
    },
    'truyen-nguoc': {
        crawlFunction: CrawlTruyenNguoc,
        model: TruyenNguoc,
        name: 'TruyenNguoc'
    },
    'truyen-sung': {
        crawlFunction: CrawlTruyenSung,
        model: TruyenSung,
        name: 'TruyenSung'
    },
    'truyen-cung-dau': {
        crawlFunction: CrawlTruyenCungDau,
        model: TruyenCungDau,
        name: 'TruyenCungDau'
    },
    'truyen-nu-cuong': {
        crawlFunction: CrawlTruyenNuCuong,
        model: TruyenNuCuong,
        name: 'TruyenNuCuong'
    },
    'truyen-dong-phuong': {
        crawlFunction: CrawlTruyenDongPhuong,
        model: TruyenDongPhuong,
        name: 'TruyenDongPhuong'
    },
    'truyen-dam-my': {
        crawlFunction: CrawlTruyenDamMy,
        model: TruyenDamMy,
        name: 'TruyenDamMy'
    },
    'truyen-bach-hop': {
        crawlFunction: CrawlTruyenBachHop,
        model: TruyenBachHop,
        name: 'TruyenBachHop'
    },
    'truyen-hai-huoc': {
        crawlFunction: CrawlTruyenHaiHuoc,
        model: TruyenHaiHuoc,
        name: 'TruyenHaiHuoc'
    },
    'truyen-co-dai': {
        crawlFunction: CrawlTruyenCoDai,
        model: TruyenCoDai,
        name: 'TruyenCoDai'
    },
    'truyen-mat-the': {
        crawlFunction: CrawlTruyenMatThe,
        model: TruyenMatThe,
        name: 'TruyenMatThe'
    },
    'truyen-tieu-thuyet': {
        crawlFunction: CrawlTruyenTieuThuyet,
        model: TruyenTieuThuyet,
        name: 'TruyenTieuThuyet'
    },
    'truyen-khac': {
        crawlFunction: CrawlTruyenKhac,
        model: TruyenKhac,
        name: 'TruyenKhac'
    },
    'truyen-vong-du': {
        crawlFunction: CrawlTruyenVongDu,
        model: TruyenVongDu,
        name: 'TruyenVongDu'
    },
    'truyen-khoa-huyen': {
        crawlFunction: CrawlTruyenKhoaHuyen,
        model: TruyenKhoaHuyen,
        name: 'TruyenKhoaHuyen'
    },
    'truyen-di-nang': {
        crawlFunction: CrawlTruyenDiNang,
        model: TruyenDiNang,
        name: 'TruyenDiNang'
    },
    'truyen-huyen-huyen': {
        crawlFunction: CrawlTruyenHuyenHuyen,
        model: TruyenHuyenHuyen,
        name: 'TruyenHuyenHuyen'
    },
    'truyen-trong-sinh': {
        crawlFunction: CrawlTruyenTrongSinh,
        model: TruyenTrongSinh,
        name: 'TruyenTrongSinh'
    },
    'truyen-do-thi': {
        crawlFunction: CrawlTruyenDoThi,
        model: TruyenDoThi,
        name: 'TruyenDoThi'
    },
    'truyen-di-gioi': {
        crawlFunction: CrawlTruyenDiGioi,
        model: TruyenDiGioi,
        name: 'TruyenDiGioi'
    },
    'truyen-gia-dau': {
        crawlFunction: CrawlTruyenGiaDau,
        model: TruyenGiaDau,
        name: 'TruyenGiaDau'
    },
    'truyen-dien-van': {
        crawlFunction: CrawlTruyenDienVan,
        model: TruyenDienVan,
        name: 'TruyenDienVan'
    },
    'truyen-nu-phu': {
        crawlFunction: CrawlTruyenNuPhu,
        model: TruyenNuPhu,
        name: 'TruyenNuPhu'
    },
    'truyen-quan-su': {
        crawlFunction: CrawlTruyenQuanSu,
        model: TruyenQuanSu,
        name: 'TruyenQuanSu'
    },
    'truyen-lich-su': {
        crawlFunction: CrawlTruyenLichSu,
        model: TruyenLichSu,
        name: 'TruyenLichSu'
    },
    'truyen-teen': {
        crawlFunction: CrawlTruyenTeen,
        model: TruyenTeen,
        name: 'TruyenTeen'
    },
    'truyen-light-novel': {
        crawlFunction: CrawlTruyenLightNovel,
        model: TruyenLightNovel,
        name: 'TruyenLightNovel'
    },
    'truyen-da-su': {
        crawlFunction: CrawlTruyenDaSu,
        model: TruyenDaSu,
        name: 'TruyenDaSu'
    },
    'truyen-doan-van': {
        crawlFunction: CrawlTruyenDoanVan,
        model: TruyenDoanVan,
        name: 'TruyenDoanVan'
    },
    'truyen-phuong-tay': {
        crawlFunction: CrawlTruyenPhuongTay,
        model: TruyenPhuongTay,
        name: 'TruyenPhuongTay'
    },
    'truyen-viet-nam': {
        crawlFunction: CrawlTruyenVietNam,
        model: TruyenVietNam,
        name: 'TruyenVietNam'
    },
    'truyen-he-thong': {
        crawlFunction: CrawlTruyenHeThong,
        model: TruyenHeThong,
        name: 'TruyenHeThong'
    },
    'truyen-xuyen-nhanh': {
        crawlFunction: CrawlTruyenXuyenNhanh,
        model: TruyenXuyenNhanh,
        name: 'TruyenXuyenNhanh'
    },
    'truyen-hien-dai': {
        crawlFunction: CrawlTruyenHienDai,
        model: TruyenHienDai,
        name: 'TruyenHienDai'
    },
    'truyen-tong-tai': {
        crawlFunction: CrawlTruyenTongTai,
        model: TruyenTongTai,
        name: 'TruyenTongTai'
    }
};

// Hàm tạo slug từ tiêu đề (chung cho tất cả)
const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
};

// Hàm xử lý dữ liệu truyện chung (thay thế cho logic trùng lặp)
const processTruyenData = async (type) => {
    const config = TRUYEN_SERVICE_CONFIGS[type];
    if (!config) {
        throw new Error(`Unknown type: ${type}`);
    }

    const { crawlFunction, model, name } = config;

    try {
        // Crawl dữ liệu từ website
        const data = await crawlFunction();

        if (!data || data.length === 0) {
            console.error(`${name}: No data to save`);
            return;
        }

        let savedCount = 0;
        let skippedCount = 0;

        // Xử lý từng item
        for (const item of data) {
            try {
                // Tạo slug từ title nếu không có
                const slug = item.Slug ? removeVietnameseTones(item.Slug) : removeVietnameseTones(item.Title || 'Unknown');

                // Kiểm tra xem slug đã tồn tại hay chưa
                const existingItem = await model.findOne({ where: { Slug: slug } });

                if (!existingItem) {
                    // Tạo item mới nếu chưa tồn tại
                    await model.create({
                        Slug: slug,
                        ImageLinks: item.ImageLinks || "N/A",
                        Title: item.Title || "No Title available",
                        LinkComic: item.LinkComic || "No LinkComic available",
                        Author: item.Author || "No author available",
                        Chapters: item.Chapters || "No chapters available",
                    });
                    savedCount++;
                } else {
                    skippedCount++;
                }
            } catch (itemError) {
                console.error(`Error processing item in ${name}:`, itemError.message);
            }
        }

        console.log(`✅ ${name}: ${savedCount} items saved, ${skippedCount} items skipped`);
        return { savedCount, skippedCount, total: data.length };

    } catch (error) {
        console.error(`❌ Error in ${name}:`, error.message);
        throw error;
    }
};

module.exports = {
    // Service cơ bản
    TruyenHotServices: () => processTruyenData('truyen-hot'),
    TruyenMoiCapNhatServices: () => processTruyenData('truyen-moi-cap-nhat'),
    TruyenFullServices: () => processTruyenData('truyen-full'),
    TruyenKiemHiepServices: () => processTruyenData('truyen-kiem-hiep'),
    TruyenTienHiepServices: () => processTruyenData('truyen-tien-hiep'),
    TruyenNgonTinhServices: () => processTruyenData('truyen-ngon-tinh'),
    TruyenQuanTruongServices: () => processTruyenData('truyen-quan-truong'),
    TruyenXuyenKhongServices: () => processTruyenData('truyen-xuyen-khong'),
    TruyenTrinhThamServices: () => processTruyenData('truyen-trinh-tham'),
    TruyenThamHiemServices: () => processTruyenData('truyen-tham-hiem'),
    TruyenLinhDiServices: () => processTruyenData('truyen-linh-di'),
    TruyenNguocServices: () => processTruyenData('truyen-nguoc'),
    TruyenSungServices: () => processTruyenData('truyen-sung'),
    TruyenCungDauServices: () => processTruyenData('truyen-cung-dau'),
    TruyenNuCuongServices: () => processTruyenData('truyen-nu-cuong'),
    TruyenDongPhuongServices: () => processTruyenData('truyen-dong-phuong'),
    TruyenDamMyServices: () => processTruyenData('truyen-dam-my'),
    TruyenBachHopServices: () => processTruyenData('truyen-bach-hop'),
    TruyenHaiHuocServices: () => processTruyenData('truyen-hai-huoc'),
    TruyenCoDaiServices: () => processTruyenData('truyen-co-dai'),
    TruyenMatTheServices: () => processTruyenData('truyen-mat-the'),
    TruyenTieuThuyetServices: () => processTruyenData('truyen-tieu-thuyet'),
    TruyenKhacServices: () => processTruyenData('truyen-khac'),
    TruyenVongDuServices: () => processTruyenData('truyen-vong-du'),
    TruyenKhoaHuyenServices: () => processTruyenData('truyen-khoa-huyen'),
    TruyenDiNangServices: () => processTruyenData('truyen-di-nang'),
    TruyenHuyenHuyenServices: () => processTruyenData('truyen-huyen-huyen'),
    TruyenTrongSinhServices: () => processTruyenData('truyen-trong-sinh'),
    TruyenDoThiServices: () => processTruyenData('truyen-do-thi'),
    TruyenDiGioiServices: () => processTruyenData('truyen-di-gioi'),
    TruyenGiaDauServices: () => processTruyenData('truyen-gia-dau'),
    TruyenDienVanServices: () => processTruyenData('truyen-dien-van'),
    TruyenNuPhuServices: () => processTruyenData('truyen-nu-phu'),
    TruyenQuanSuServices: () => processTruyenData('truyen-quan-su'),
    TruyenLichSuServices: () => processTruyenData('truyen-lich-su'),
    TruyenTeenServices: () => processTruyenData('truyen-teen'),
    TruyenLightNovelServices: () => processTruyenData('truyen-light-novel'),
    TruyenDaSuServices: () => processTruyenData('truyen-da-su'),
    TruyenDoanVanServices: () => processTruyenData('truyen-doan-van'),
    TruyenPhuongTayServices: () => processTruyenData('truyen-phuong-tay'),
    TruyenVietNamServices: () => processTruyenData('truyen-viet-nam'),
    TruyenHeThongServices: () => processTruyenData('truyen-he-thong'),
    TruyenXuyenNhanhServices: () => processTruyenData('truyen-xuyen-nhanh'),
    TruyenHienDaiServices: () => processTruyenData('truyen-hien-dai'),
    TruyenTongTaiServices: () => processTruyenData('truyen-tong-tai'),

    // === UTILITY FUNCTIONS ===

    // Hàm tạo slug (có thể sử dụng bên ngoài)
    removeVietnameseTones,

    // Lấy danh sách tất cả thể loại
    getAllTruyenTypes: () => Object.keys(TRUYEN_SERVICE_CONFIGS),

    // Xử lý tất cả thể loại cùng lúc
    processAllTruyenTypes: async () => {
        const allTypes = Object.keys(TRUYEN_SERVICE_CONFIGS);
        const results = {};

        for (const type of allTypes) {
            try {
                console.log(`🔄 Processing ${TRUYEN_SERVICE_CONFIGS[type].name}...`);
                results[type] = await processTruyenData(type);
                console.log(`✅ ${TRUYEN_SERVICE_CONFIGS[type].name} completed`);
            } catch (error) {
                console.error(`❌ Error processing ${type}:`, error.message);
                results[type] = { error: error.message };
            }
        }

        return results;
    },

    // Xử lý một thể loại cụ thể theo tên
    processTruyenTypeByName: async (typeName) => {
        const type = Object.keys(TRUYEN_SERVICE_CONFIGS).find(key =>
            TRUYEN_SERVICE_CONFIGS[key].name === typeName
        );

        if (!type) {
            throw new Error(`Unknown type name: ${typeName}`);
        }

        return await processTruyenData(type);
    }
};
