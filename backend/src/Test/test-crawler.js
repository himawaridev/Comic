const {
    CrawlTruyenHot,
    CrawlTruyenKiemHiep,
    CrawlTruyenTienHiep,
    CrawlTruyenMoiCapNhat
} = require('../Data/TruyenDataCrawler');

// Test crawl từng loại truyện
async function testCrawlers() {
    console.log('🚀 Bắt đầu test các crawler...\n');

    try {
        // Test 1: Crawl Truyen Hot
        console.log('📚 Đang crawl Truyen Hot...');
        const hotData = await CrawlTruyenHot();
        console.log(`✅ Truyen Hot: ${hotData.length} truyện\n`);

        // Test 2: Crawl Truyen Kiem Hiep
        console.log('⚔️ Đang crawl Truyen Kiem Hiep...');
        const kiemHiepData = await CrawlTruyenKiemHiep();
        console.log(`✅ Truyen Kiem Hiep: ${kiemHiepData.length} truyện\n`);

        // Test 3: Crawl Truyen Tien Hiep
        console.log('🧙 Đang crawl Truyen Tien Hiep...');
        const tienHiepData = await CrawlTruyenTienHiep();
        console.log(`✅ Truyen Tien Hiep: ${tienHiepData.length} truyện\n`);

        // Test 4: Crawl Truyen Moi Cap Nhat
        console.log('🆕 Đang crawl Truyen Moi Cap Nhat...');
        const moiCapNhatData = await CrawlTruyenMoiCapNhat();
        console.log(`✅ Truyen Moi Cap Nhat: ${moiCapNhatData.length} truyện\n`);

        console.log('🎉 Tất cả crawler đã chạy thành công!');

        // In tổng số truyện
        const totalTruyen = hotData.length + kiemHiepData.length + tienHiepData.length + moiCapNhatData.length;
        console.log(`📊 Tổng cộng: ${totalTruyen} truyện`);

    } catch (error) {
        console.error('❌ Lỗi khi test crawler:', error.message);
    }
}

module.exports = {
    testCrawlers
}