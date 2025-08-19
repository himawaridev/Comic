/**
 * TRUYEN ROUTER UNIFIED
 * File gộp duy nhất chứa tất cả các router cho các thể loại truyện
 * Thay thế cho các file riêng biệt: TruyenHotRouter.js, TruyenKiemHiepRouter.js, v.v.
 */

const express = require('express');
const router = express.Router();
const pagination = require('../middleware/pagination');
const { ok, fail } = require('../utils/response');

// Import tất cả controller từ Controller unified
const {
    getTruyenHotController,
    getTruyenKiemHiepController,
    getTruyenTienHiepController,
    getTruyenMoiCapNhatController,
    getTruyenQuanTruongController
} = require('../Controller/TruyenControllerUnified');
// Import controller tách riêng cho TheLoaiTruyen
const { getTheLoaiTruyenController } = require('../Controller/TheLoaiTruyenController');

/**
 * Định nghĩa tất cả các route cho các thể loại truyện
 */

// Route cho TruyenHot
router.get('/getTruyenHotController', pagination, getTruyenHotController);

// Route cho TruyenKiemHiep
router.get('/getTruyenKiemHiepController', pagination, getTruyenKiemHiepController);

// Route cho TruyenTienHiep
router.get('/getTruyenTienHiepController', pagination, getTruyenTienHiepController);

// Route cho TruyenMoiCapNhat
router.get('/getTruyenMoiCapNhatController', pagination, getTruyenMoiCapNhatController);

// Route cho TruyenQuanTruong
router.get('/getTruyenQuanTruongController', pagination, getTruyenQuanTruongController);

// Route cho TheLoaiTruyen
router.get('/getTheLoaiTruyenController', getTheLoaiTruyenController);

/**
 * Route tổng hợp để lấy tất cả dữ liệu truyện
 * Có thể sử dụng để lấy nhiều loại truyện cùng lúc
 */
router.get('/getAllTruyen', async (req, res) => {
    try {
        const { types } = req.query;
        const truyenTypes = types ? types.split(',') : ['hot', 'kiemhiep', 'tienhiep', 'moicapnhat', 'quantruong'];

        // Chuẩn hóa pagination chung
        pagination(req, res, () => { });
        const { fetchTruyenData } = require('../Controller/TruyenControllerUnified');

        const typeToModelMap = {
            hot: 'TruyenHot',
            kiemhiep: 'TruyenKiemHiep',
            tienhiep: 'TruyenTienHiep',
            moicapnhat: 'TruyenMoiCapNhat',
            quantruong: 'TruyenQuanTruong'
        };

        const results = {};
        for (const type of truyenTypes) {
            const modelName = typeToModelMap[type];
            if (!modelName) {
                results[type] = { error: `Unsupported type: ${type}` };
                continue;
            }
            try {
                const { count, rows } = await fetchTruyenData(modelName, req.pagination);
                results[type] = { [`${modelName}Controller`]: rows, total: count };
            } catch (error) {
                results[type] = { error: error.message };
            }
        }

        return ok(res, 'data', results);
    } catch (error) {
        return fail(res, 500, error.message);
    }
});

/**
 * Route để lấy thông tin về các loại truyện có sẵn
 */
router.get('/truyen-types', (req, res) => {
    const availableTypes = [
        {
            name: 'TruyenHot',
            route: '/getTruyenHotController',
            description: 'Truyện hot được yêu thích'
        },
        {
            name: 'TruyenKiemHiep',
            route: '/getTruyenKiemHiepController',
            description: 'Truyện kiếm hiệp'
        },
        {
            name: 'TruyenTienHiep',
            route: '/getTruyenTienHiepController',
            description: 'Truyện tiên hiệp'
        },
        {
            name: 'TruyenMoiCapNhat',
            route: '/getTruyenMoiCapNhatController',
            description: 'Truyện mới cập nhật'
        },
        {
            name: 'TruyenQuanTruong',
            route: '/getTruyenQuanTruongController',
            description: 'Truyện quan trường'
        },
        {
            name: 'TheLoaiTruyen',
            route: '/getTheLoaiTruyenController',
            description: 'Thể loại truyện'
        }
    ];

    return res.status(200).json({
        message: 'Available truyen types',
        types: availableTypes,
        total: availableTypes.length
    });
});

module.exports = router;
