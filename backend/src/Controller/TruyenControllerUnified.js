/**
 * TRUYEN CONTROLLER UNIFIED
 * File gộp duy nhất chứa tất cả các controller cho các thể loại truyện
 * Thay thế cho các file riêng biệt: TruyenHotController.js, TruyenKiemHiepController.js, v.v.
 */

// Import tất cả model từ Model
const {
    TruyenHot,
    TruyenKiemHiep,
    TruyenTienHiep,
    TruyenMoiCapNhat,
    TruyenQuanTruong
} = require('../Model');
const { order } = require('../config/constants');
const { ok, fail } = require('../utils/response');

/**
 * Generic controller function cho tất cả các loại truyện
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} modelName - Tên model (ví dụ: 'TruyenHot', 'TruyenKiemHiep')
 * @param {string} responseKey - Key cho response JSON (ví dụ: 'TruyenHotController')
 */
const getTruyenController = async (req, res, modelName, responseKey) => {
    try {
        const pagination = req.pagination || { page: 1, limit: 10, offset: 0 };

        const model = getModelByName(modelName);
        if (!model) {
            return fail(res, 400, `Model ${modelName} not found`);
        }

        const { count, rows } = await model.findAndCountAll({
            limit: pagination.limit,
            offset: pagination.offset,
            order: order.default
        });

        return ok(res, responseKey, rows, count, 200);
    } catch (error) {
        return fail(res, 500, error.message);
    }
};

/**
 * Core fetching dùng lại cho các use-case khác (ví dụ: route tổng hợp)
 * @param {string} modelName
 * @param {{limit:number, offset:number}} pagination
 * @param {Array} orderBy
 * @returns {Promise<{count:number, rows:Array}>}
 */
const fetchTruyenData = async (modelName, pagination, orderBy = order.default) => {
    const model = getModelByName(modelName);
    if (!model) {
        throw new Error(`Model ${modelName} not found`);
    }
    const { count, rows } = await model.findAndCountAll({
        limit: pagination.limit,
        offset: pagination.offset,
        order: orderBy
    });
    return { count, rows };
};

/**
 * Helper function để lấy model theo tên
 * @param {string} modelName - Tên model
 * @returns {Object|null} - Model object hoặc null nếu không tìm thấy
 */
const getModelByName = (modelName) => {
    const models = {
        'TruyenHot': TruyenHot,
        'TruyenKiemHiep': TruyenKiemHiep,
        'TruyenTienHiep': TruyenTienHiep,
        'TruyenMoiCapNhat': TruyenMoiCapNhat,
        'TruyenQuanTruong': TruyenQuanTruong
    };
    return models[modelName] || null;
};

/**
 * Controller cho TruyenHot
 */
const getTruyenHotController = async (req, res) => {
    return getTruyenController(req, res, 'TruyenHot', 'TruyenHotController');
};

/**
 * Controller cho TruyenKiemHiep
 */
const getTruyenKiemHiepController = async (req, res) => {
    return getTruyenController(req, res, 'TruyenKiemHiep', 'TruyenKiemHiepController');
};

/**
 * Controller cho TruyenTienHiep
 */
const getTruyenTienHiepController = async (req, res) => {
    return getTruyenController(req, res, 'TruyenTienHiep', 'TruyenTienHiepController');
};

/**
 * Controller cho TruyenMoiCapNhat
 */
const getTruyenMoiCapNhatController = async (req, res) => {
    return getTruyenController(req, res, 'TruyenMoiCapNhat', 'TruyenMoiCapNhatController');
};

/**
 * Controller cho TruyenQuanTruong
 */
const getTruyenQuanTruongController = async (req, res) => {
    return getTruyenController(req, res, 'TruyenQuanTruong', 'TruyenQuanTruongController');
};

module.exports = {
    getTruyenHotController,
    getTruyenKiemHiepController,
    getTruyenTienHiepController,
    getTruyenMoiCapNhatController,
    getTruyenQuanTruongController,
    // Export generic function để có thể sử dụng cho các loại truyện khác
    getTruyenController,
    fetchTruyenData
};
