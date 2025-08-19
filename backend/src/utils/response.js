/**
 * Utils chuẩn hóa response API
 */

/**
 * Trả về response thành công với cấu trúc thống nhất
 * @param {import('express').Response} res
 * @param {string} key - Tên key bao bọc dữ liệu (ví dụ: 'TruyenHotController')
 * @param {Array|Object} data - Dữ liệu trả về
 * @param {number} [total] - Tổng số bản ghi (nếu có)
 * @param {number} [status=200]
 */
function ok(res, key, data, total, status = 200) {
    if (typeof total === 'number') {
        return res.status(status).json({ [key]: data, total });
    }
    return res.status(status).json({ [key]: data });
}

/**
 * Trả về response lỗi với cấu trúc thống nhất
 * @param {import('express').Response} res
 * @param {number} [status=500]
 * @param {string} message
 */
function fail(res, status = 500, message = 'Internal Server Error') {
    return res.status(status).json({ error: message });
}

module.exports = { ok, fail };
