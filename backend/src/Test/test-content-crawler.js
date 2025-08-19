// File test để kiểm tra chức năng crawl nội dung chi tiết
const {
    CrawlTruyenHot,
    CrawlTruyenHotWithContent,
    CrawlTruyenContent
} = require('../Data/TruyenCrawlerData');

// Test 1: Crawl danh sách truyện cơ bản (chỉ có LinkComic)
async function testBasicCrawl() {
    console.log('🚀 Test 1: Crawl danh sách truyện cơ bản...\n');

    try {
        const hotData = await CrawlTruyenHot();
        console.log(`✅ Crawl cơ bản thành công: ${hotData.length} truyện`);
        console.log(`📖 Truyện đầu tiên: ${hotData[0]?.Title}`);
        console.log(`🔗 LinkComic: ${hotData[0]?.LinkComic}`);
        console.log(`📝 Chỉ có thông tin cơ bản: ${Object.keys(hotData[0]).length} trường\n`);

        return hotData;
    } catch (error) {
        console.error('❌ Lỗi khi crawl cơ bản:', error.message);
        return [];
    }
}

// Test 2: Crawl danh sách truyện + nội dung chi tiết
async function testContentCrawl() {
    console.log('🚀 Test 2: Crawl danh sách truyện + nội dung chi tiết...\n');

    try {
        // Chỉ crawl 1 trang để test nhanh
        const hotDataWithContent = await CrawlTruyenHotWithContent();
        console.log(`✅ Crawl với nội dung thành công: ${hotDataWithContent.length} truyện`);

        if (hotDataWithContent.length > 0) {
            const firstTruyen = hotDataWithContent[0];
            console.log(`📖 Truyện: ${firstTruyen.Title}`);
            console.log(`📝 Số trường dữ liệu: ${Object.keys(firstTruyen).length}`);
            console.log(`⭐ Rating: ${firstTruyen.Rating}`);
            console.log(`📊 Số chương: ${firstTruyen.Chapters?.length || 0}`);
            console.log(`🏷️ Số tags: ${firstTruyen.Tags?.length || 0}`);
            console.log(`📚 Số thể loại: ${firstTruyen.Genres?.length || 0}\n`);
        }

        return hotDataWithContent;
    } catch (error) {
        console.error('❌ Lỗi khi crawl với nội dung:', error.message);
        return [];
    }
}

// Test 3: Crawl nội dung chi tiết của một truyện cụ thể
async function testSingleContentCrawl() {
    console.log('🚀 Test 3: Crawl nội dung chi tiết của một truyện...\n');

    try {
        // Lấy danh sách truyện trước
        const hotData = await CrawlTruyenHot();
        if (hotData.length === 0) {
            console.log('❌ Không có dữ liệu để test');
            return;
        }

        // Chọn truyện đầu tiên để test
        const testTruyen = hotData[0];
        console.log(`📖 Đang crawl nội dung: ${testTruyen.Title}`);
        console.log(`🔗 Link: ${testTruyen.LinkComic}\n`);

        const content = await CrawlTruyenContent(testTruyen.LinkComic);
        if (content) {
            console.log(`✅ Crawl nội dung thành công!`);
            console.log(`📝 Tên truyện: ${content.NameComic}`);
            console.log(`⭐ Rating: ${content.Rating} (${content.RatingCount} đánh giá)`);
            console.log(`📖 Mô tả: ${content.Description?.substring(0, 100)}...`);
            console.log(`👤 Tác giả: ${content.Author}`);
            console.log(`📊 Trạng thái: ${content.Status}`);
            console.log(`🏷️ Tags: ${content.Tags?.map(t => t.Text).join(', ')}`);
            console.log(`📚 Thể loại: ${content.Genres?.map(g => g.Text).join(', ')}`);
            console.log(`📖 Số chương: ${content.Chapters?.length || 0}\n`);
        } else {
            console.log('❌ Không thể crawl nội dung truyện này\n');
        }

    } catch (error) {
        console.error('❌ Lỗi khi crawl nội dung đơn lẻ:', error.message);
    }
}

// Chạy tất cả test
async function runAllTests() {
    console.log('🎯 BẮT ĐẦU TEST CRAWLER VỚI NỘI DUNG CHI TIẾT\n');
    console.log('='.repeat(60) + '\n');

    // Test 1: Crawl cơ bản
    await testBasicCrawl();
    console.log('='.repeat(60) + '\n');

    // Test 2: Crawl với nội dung
    await testContentCrawl();
    console.log('='.repeat(60) + '\n');

    // Test 3: Crawl nội dung đơn lẻ
    await testSingleContentCrawl();
    console.log('='.repeat(60) + '\n');

    console.log('🎉 HOÀN THÀNH TẤT CẢ TEST!');
}

module.exports = {
    runAllTests
}
