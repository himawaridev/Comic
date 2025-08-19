const express = require('express');
const router = express.Router();

// Import controller
const {
    getTheLoaiTruyenController
} = require('../Controller/TheLoaiTruyenController');

// Định nghĩa route GET /truyen-tien-hiep
router.get('/getTheLoaiTruyenController', getTheLoaiTruyenController);

module.exports = router;