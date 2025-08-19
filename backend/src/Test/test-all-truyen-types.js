// File test để kiểm tra tất cả các thể loại truyện mới
const {
    getAllTruyenTypes,
    CrawlAllTruyenTypes,
    CrawlTruyenNgonTinh,
    CrawlTruyenQuanTruong,
    CrawlTruyenXuyenKhong
} = require('../Data/TruyenDataCrawler');

// Test 1: Lấy danh sách tất cả thể loại
function testGetAllTypes() {
    console.log('🚀 Test 1: Lấy danh sách tất cả thể loại truyện...\n');

    const allTypes = getAllTruyenTypes();
    console.log(`✅ Tổng cộng: ${allTypes.length} thể loại truyện`);
    console.log('📋 Danh sách thể loại:');

    allTypes.forEach((type, index) => {
        console.log(`   ${index + 1}. ${type}`);
    });

    console.log('\n' + '='.repeat(60) + '\n');
    return allTypes;
}

// Test 2: Test crawl một vài thể loại cụ thể
async function testSpecificTypes() {
    console.log('🚀 Test 2: Test crawl một vài thể loại cụ thể...\n');

    try {
        // Test crawl Ngôn Tình
        console.log('📚 Đang crawl Truyen Ngon Tinh...');
        const ngonTinhData = await CrawlTruyenNgonTinh();
        console.log(`✅ Ngôn Tình: ${ngonTinhData.length} truyện\n`);

        // Test crawl Quan Trường
        console.log('🏛️ Đang crawl Truyen Quan Truong...');
        const quanTruongData = await CrawlTruyenQuanTruong();
        console.log(`✅ Quan Trường: ${quanTruongData.length} truyện\n`);

        // Test crawl Xuyên Không
        console.log('⏰ Đang crawl Truyen Xuyen Khong...');
        const xuyenKhongData = await CrawlTruyenXuyenKhong();
        console.log(`✅ Xuyên Không: ${xuyenKhongData.length} truyện\n`);

        return {
            ngonTinh: ngonTinhData,
            quanTruong: quanTruongData,
            xuyenKhong: xuyenKhongData
        };

    } catch (error) {
        console.error('❌ Lỗi khi test crawl cụ thể:', error.message);
        return {};
    }
}

// Test 3: Test crawl tất cả thể loại (chỉ 1 trang để test nhanh)
async function testCrawlAllTypes() {
    console.log('🚀 Test 3: Test crawl tất cả thể loại (chỉ 1 trang)...\n');

    try {
        // Tạm thời chỉ test crawl cơ bản (không có nội dung chi tiết)
        console.log('🔄 Đang crawl tất cả thể loại...');
        const allResults = await CrawlAllTruyenTypes(false);

        console.log('\n📊 Kết quả crawl tất cả thể loại:');
        let totalTruyen = 0;

        Object.keys(allResults).forEach(type => {
            const count = allResults[type].length;
            totalTruyen += count;
            console.log(`   ${type}: ${count} truyện`);
        });

        console.log(`\n🎯 Tổng cộng: ${totalTruyen} truyện từ ${Object.keys(allResults).length} thể loại`);

        return allResults;

    } catch (error) {
        console.error('❌ Lỗi khi crawl tất cả thể loại:', error.message);
        return {};
    }
}

// Test 4: Test crawl một thể loại với nội dung chi tiết
async function testWithContent() {
    console.log('🚀 Test 4: Test crawl với nội dung chi tiết...\n');

    try {
        // Test crawl Ngôn Tình với nội dung chi tiết
        console.log('📚 Đang crawl Ngôn Tình với nội dung chi tiết...');
        const { CrawlTruyenNgonTinhWithContent } = require('../Data/TruyenDataCrawler');

        const ngonTinhWithContent = await CrawlTruyenNgonTinhWithContent();
        console.log(`✅ Ngôn Tình với nội dung: ${ngonTinhWithContent.length} truyện`);

        if (ngonTinhWithContent.length > 0) {
            const firstTruyen = ngonTinhWithContent[0];
            console.log(`📖 Truyện đầu tiên: ${firstTruyen.Title}`);
            console.log(`📝 Số trường dữ liệu: ${Object.keys(firstTruyen).length}`);
            console.log(`⭐ Rating: ${firstTruyen.Rating}`);
            console.log(`📊 Số chương: ${firstTruyen.Chapters?.length || 0}`);
        }

        return ngonTinhWithContent;

    } catch (error) {
        console.error('❌ Lỗi khi test với nội dung:', error.message);
        return [];
    }
}

// Chạy tất cả test
async function runAllTests() {
    console.log('🎯 BẮT ĐẦU TEST TẤT CẢ THỂ LOẠI TRUYỆN\n');
    console.log('='.repeat(60) + '\n');

    // Test 1: Lấy danh sách thể loại
    const allTypes = testGetAllTypes();

    // Test 2: Test crawl cụ thể
    await testSpecificTypes();

    // Test 3: Test crawl tất cả (chỉ 1 trang)
    await testCrawlAllTypes();

    // Test 4: Test với nội dung chi tiết
    await testWithContent();

    console.log('='.repeat(60) + '\n');
    console.log('🎉 HOÀN THÀNH TẤT CẢ TEST!');
    console.log(`📚 Tổng cộng ${allTypes.length} thể loại truyện đã được thêm vào hệ thống!`);
}

// Export để có thể chạy từ bên ngoài
module.exports = {
    runAllTests,
    testGetAllTypes,
    testSpecificTypes,
    testCrawlAllTypes,
    testWithContent
};

// Chạy test nếu file được chạy trực tiếp
if (require.main === module) {
    runAllTests();
}
