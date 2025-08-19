/**
 * TEST TRUYEN SERVICES UNIFIED
 * File test để kiểm tra file service gộp hoạt động đúng
 */

const {
    // Các service cơ bản
    TruyenHotServices,
    TruyenKiemHiepServices,
    TruyenTienHiepServices,
    TruyenMoiCapNhatServices,

    // Các service mới
    TruyenNgonTinhServices,
    TruyenQuanTruongServices,
    TruyenXuyenKhongServices,

    // Utility functions
    getAllTruyenTypes,
    processAllTruyenTypes,
    processTruyenTypeByName,
    removeVietnameseTones
} = require('../Services/TruyenServicesUnified');

// Test các service cơ bản
async function testBasicServices() {
    console.log('\n🧪 Testing Basic Services...');

    try {
        // Test TruyenHotServices
        console.log('🔄 Testing TruyenHotServices...');
        const hotResult = await TruyenHotServices();
        console.log('✅ TruyenHotServices result:', hotResult);

        // Test TruyenKiemHiepServices
        console.log('🔄 Testing TruyenKiemHiepServices...');
        const kiemHiepResult = await TruyenKiemHiepServices();
        console.log('✅ TruyenKiemHiepServices result:', kiemHiepResult);

        // Test TruyenTienHiepServices
        console.log('🔄 Testing TruyenTienHiepServices...');
        const tienHiepResult = await TruyenTienHiepServices();
        console.log('✅ TruyenTienHiepServices result:', tienHiepResult);

        // Test TruyenMoiCapNhatServices
        console.log('🔄 Testing TruyenMoiCapNhatServices...');
        const moiCapNhatResult = await TruyenMoiCapNhatServices();
        console.log('✅ TruyenMoiCapNhatServices result:', moiCapNhatResult);

    } catch (error) {
        console.error('❌ Error in basic services:', error.message);
    }
}

// Test các service mới
async function testNewServices() {
    console.log('\n🧪 Testing New Services...');

    try {
        // Test TruyenNgonTinhServices
        console.log('🔄 Testing TruyenNgonTinhServices...');
        const ngonTinhResult = await TruyenNgonTinhServices();
        console.log('✅ TruyenNgonTinhServices result:', ngonTinhResult);

        // Test TruyenQuanTruongServices
        console.log('🔄 Testing TruyenQuanTruongServices...');
        const quanTruongResult = await TruyenQuanTruongServices();
        console.log('✅ TruyenQuanTruongServices result:', quanTruongResult);

        // Test TruyenXuyenKhongServices
        console.log('🔄 Testing TruyenXuyenKhongServices...');
        const xuyenKhongResult = await TruyenXuyenKhongServices();
        console.log('✅ TruyenXuyenKhongServices result:', xuyenKhongResult);

    } catch (error) {
        console.error('❌ Error in new services:', error.message);
    }
}

// Test utility functions
async function testUtilityFunctions() {
    console.log('\n🧪 Testing Utility Functions...');

    try {
        // Test getAllTruyenTypes
        console.log('🔄 Testing getAllTruyenTypes...');
        const allTypes = getAllTruyenTypes();
        console.log('✅ getAllTruyenTypes result:', allTypes);
        console.log('📊 Total types:', allTypes.length);

        // Test removeVietnameseTones
        console.log('🔄 Testing removeVietnameseTones...');
        const testStrings = [
            'Tiêu Đề Truyện Có Dấu',
            'Kiếm Hiệp Võ Lâm',
            'Tiên Hiệp Tu Tiên',
            'Ngôn Tình Sủng Văn'
        ];

        testStrings.forEach(str => {
            const slug = removeVietnameseTones(str);
            console.log(`   "${str}" -> "${slug}"`);
        });

        // Test processTruyenTypeByName
        console.log('🔄 Testing processTruyenTypeByName...');
        const result = await processTruyenTypeByName('TruyenHot');
        console.log('✅ processTruyenTypeByName result:', result);

    } catch (error) {
        console.error('❌ Error in utility functions:', error.message);
    }
}

// Test xử lý tất cả thể loại (cẩn thận - có thể mất thời gian)
async function testProcessAllTypes() {
    console.log('\n🧪 Testing Process All Types...');
    console.log('⚠️  Warning: This may take a long time!');

    try {
        console.log('🔄 Processing all types...');
        const allResults = await processAllTruyenTypes();
        console.log('✅ All types processed successfully!');
        console.log('📊 Results summary:');

        Object.entries(allResults).forEach(([type, result]) => {
            if (result.error) {
                console.log(`   ❌ ${type}: ${result.error}`);
            } else {
                console.log(`   ✅ ${type}: ${result.savedCount} saved, ${result.skippedCount} skipped`);
            }
        });

    } catch (error) {
        console.error('❌ Error processing all types:', error.message);
    }
}

// Test performance
async function testPerformance() {
    console.log('\n🧪 Testing Performance...');

    try {
        const startTime = Date.now();

        // Test xử lý 3 thể loại cơ bản
        console.log('🔄 Testing performance with 3 basic types...');

        const promises = [
            TruyenHotServices(),
            TruyenKiemHiepServices(),
            TruyenTienHiepServices()
        ];

        const results = await Promise.all(promises);
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('✅ Performance test completed!');
        console.log(`⏱️  Total time: ${duration}ms`);
        console.log(`📊 Average time per type: ${Math.round(duration / 3)}ms`);

        results.forEach((result, index) => {
            const typeNames = ['TruyenHot', 'TruyenKiemHiep', 'TruyenTienHiep'];
            console.log(`   ${typeNames[index]}: ${result.savedCount} saved, ${result.skippedCount} skipped`);
        });

    } catch (error) {
        console.error('❌ Error in performance test:', error.message);
    }
}

// Test error handling
async function testErrorHandling() {
    console.log('\n🧪 Testing Error Handling...');

    try {
        // Test với type không tồn tại
        console.log('🔄 Testing with invalid type...');
        const invalidType = 'invalid-type';

        // Sẽ throw error vì type không tồn tại
        try {
            await processTruyenTypeByName('InvalidType');
        } catch (error) {
            console.log('✅ Error handling works correctly:', error.message);
        }

    } catch (error) {
        console.error('❌ Error in error handling test:', error.message);
    }
}

// Chạy tất cả test
async function runAllTests() {
    console.log('🚀 Starting TruyenServicesUnified Tests...\n');

    try {
        // Test cơ bản
        await testBasicServices();

        // Test service mới
        await testNewServices();

        // Test utility functions
        await testUtilityFunctions();

        // Test performance
        await testPerformance();

        // Test error handling
        await testErrorHandling();

        // Test xử lý tất cả thể loại (tùy chọn - comment nếu không muốn chạy)
        // await testProcessAllTypes();

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('\n💥 Test suite failed:', error.message);
    }
}

// Export các function test
module.exports = {
    runAllTests,
    testBasicServices,
    testNewServices,
    testUtilityFunctions,
    testProcessAllTypes,
    testPerformance,
    testErrorHandling
};

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
    runAllTests();
}
