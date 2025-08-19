const { pagination } = require('../config/constants');

/**
 * Middleware chuẩn hóa tham số phân trang
 * - page, limit là số nguyên dương
 * - Giới hạn limit tối đa theo cấu hình
 * - Gắn { page, limit, offset } vào req.pagination
 */
module.exports = function paginationMiddleware(req, res, next) {
    try {
        const rawPage = parseInt(req.query.page, 10);
        const rawLimit = parseInt(req.query.limit, 10);

        const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : pagination.defaultPage;
        let limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : pagination.defaultLimit;
        if (limit > pagination.maxLimit) {
            limit = pagination.maxLimit;
        }

        const offset = (page - 1) * limit;

        req.pagination = { page, limit, offset };
        return next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
};
