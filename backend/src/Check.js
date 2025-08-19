const TheLoaiTruyenServices = require('./Services/TheLoaiTruyenServices');
const {
    TruyenTienHiepServices,
    TruyenKiemHiepServices,
    TruyenMoiCapNhatServices,
    TruyenHotServices,
    TruyenQuanTruongServices
} = require('./Services/TruyenServicesUnified');

const initServices = async () => {
    console.log("[🔄 Initializing all services in parallel...]");
    console.log("[🔍] TheLoaiTruyenServices type:", typeof TheLoaiTruyenServices);
    console.log("[🔍] TheLoaiTruyenServices value:", TheLoaiTruyenServices);

    const services = [
        {
            name: "TheLoaiTruyenServices",
            service: TheLoaiTruyenServices
        },
        {
            name: "TruyenTienHiepServices",
            service: TruyenTienHiepServices
        },
        {
            name: "TruyenKiemHiepServices",
            service: TruyenKiemHiepServices
        },
        {
            name: "TruyenMoiCapNhatServices",
            service: TruyenMoiCapNhatServices
        },
        {
            name: "TruyenHotServices",
            service: TruyenHotServices
        },
        {
            name: "TruyenQuanTruongServices",
            service: TruyenQuanTruongServices
        },
    ];

    console.log('Services loaded:', services.map(s => ({ name: s.name, type: typeof s.service })));

    try {
        // Chạy tất cả services song song
        const results = await Promise.allSettled(
            services.map(async ({ name, service }) => {
                try {
                    console.log(`[🔄] Calling service: ${name}, service type:`, typeof service);
                    if (typeof service !== 'function') {
                        throw new Error(`Service ${name} is not a function, got: ${typeof service}`);
                    }
                    console.log(`[🔄] Executing service: ${name}`);
                    await service();
                    console.log(`[✅ ${name} initialized]`);
                    console.log(' ');
                    console.log(' ');
                    return { name, success: true };
                } catch (error) {
                    console.error(`[❌ ${name} failed]:`, error.message);
                    console.error(`Error details for ${name}:`, error);
                    console.error(`Error stack for ${name}:`, error.stack);
                    return { name, success: false, error: error.message };
                }
            })
        );

        // Kiểm tra kết quả
        const failedServices = results.filter(result => result.status === 'rejected' || (result.value && !result.value.success));

        if (failedServices.length > 0) {
            console.error("[❌ Some services failed to initialize]");
            console.error("Failed services:", failedServices.map(f => f.value?.name || 'Unknown'));
            console.error("Failed services details:", failedServices);

            // Log chi tiết từng service
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`[❌] Service ${index} rejected:`, result.reason);
                } else if (result.value && !result.value.success) {
                    console.error(`[❌] Service ${index} failed:`, result.value);
                } else {
                    console.log(`[✅] Service ${index} succeeded:`, result.value);
                }
            });

            process.exit(1);
        }

        console.log('-----------------------------------------------------------------------');
        // console.log("[✅ All services initialized successfully]");
        // console.log("Results:", results);

        // Log chi tiết từng service
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`[✅] Service ${index} succeeded:`, result.value);
            } else {
                console.error(`[❌] Service ${index} rejected:`, result.reason);
            }
        });

    } catch (error) {
        console.error("[❌ Server stopped due to initialization errors]:", error.message);
        console.error("Error details:", error);
        console.error("Error stack:", error.stack);
        process.exit(1);
    }
};

module.exports = { initServices };
