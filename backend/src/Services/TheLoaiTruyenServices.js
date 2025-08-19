const { where } = require('sequelize');
const db = require('../Model');// Import tất cả models từ file `../Model`.

const THELOAITRUYEN_DEFAULT = require('../Data/TheLoaiTruyenData.json');
// Import dữ liệu mặc định của các danh mục từ file JSON.

const TheLoaiTruyenServices = async () => {
    try {
        // Kiểm tra xem model có được load đúng không
        if (!db.TheLoaiTruyen) {
            throw new Error('Model TheLoaiTruyen không được tìm thấy trong database');
        }

        console.log('TheLoaiTruyen model:', db.TheLoaiTruyen);
        // console.log('THELOAITRUYEN_DEFAULT:', THELOAITRUYEN_DEFAULT);

        // Sử dụng `Promise.all` để xử lý tất cả các mục trong mảng `THELOAITRUYEN_DEFAULT` song song.
        await Promise.all(THELOAITRUYEN_DEFAULT.map((async (cate) => {
            // console.log('[Cate: ]', cate)
            // Ghi log thông tin danh mục hiện tại (để debug hoặc kiểm tra quá trình xử lý).

            const checkExits = await db.TheLoaiTruyen.findOne({ where: { slug: cate.slug } });
            // Kiểm tra xem danh mục có tồn tại trong cơ sở dữ liệu hay không dựa trên `slug`.

            if (!checkExits) {
                // Nếu danh mục không tồn tại, thêm mới vào cơ sở dữ liệu.
                await db.TheLoaiTruyen.create({
                    ...cate // Thêm toàn bộ thông tin từ đối tượng `cate`.
                })
            }
        })));

        console.log('Khởi tạo TheLoaiTruyen thành công: Service/TheLoaiTruyenService.js');
        // Ghi log khi quá trình khởi tạo hoàn tất thành công.

    } catch (error) {
        console.error('Không thể lưu data:', error)
        throw error; // Re-throw để Check.js có thể xử lý
    };
};

module.exports = TheLoaiTruyenServices;