/**
 * THE LOAI TRUYEN CONTROLLER (TÁCH RIÊNG)
 * Xử lý các API cho bảng thể loại truyện
 */

const { TheLoaiTruyen } = require('../Model');
const { ok, fail } = require('../utils/response');

/**
 * Lấy toàn bộ thể loại truyện (không phân trang)
 */
const getTheLoaiTruyenController = async (req, res) => {
    try {
        const TheLoaiTruyenController = await TheLoaiTruyen.findAll();
        return ok(res, 'TheLoaiTruyenController', TheLoaiTruyenController);
    } catch (error) {
        return fail(res, 500, error.message);
    }
};

module.exports = { getTheLoaiTruyenController };
