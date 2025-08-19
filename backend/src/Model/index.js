const fs = require('fs');
// Import module `fs` để làm việc với file hệ thống (file system).

const path = require('path');
// Import module `path` để xử lý đường dẫn file.

const Sequelize = require('sequelize');
// Import Sequelize, một ORM để kết nối và làm việc với cơ sở dữ liệu.

const basename = path.basename(__filename);
// Lấy tên file hiện tại (vd: index.js) để loại trừ khi đọc các file trong thư mục.

const db = {};
// Tạo một đối tượng trống `db` để lưu trữ các model và thông tin kết nối cơ sở dữ liệu.

require('dotenv').config();
// Tải các biến môi trường từ file `.env` vào `process.env`.
// Điều này cho phép bạn sử dụng các biến môi trường trong ứng dụng của mình.

const sequelize = new Sequelize(
    process.env.MYSQL_DB_NAME || 'comic', // Tên cơ sở dữ liệu từ biến môi trường.
    process.env.MYSQL_USERNAME || 'root', // Tên người dùng cơ sở dữ liệu từ biến môi trường.
    process.env.MYSQL_PASSWORD || '123456', // Mật khẩu cơ sở dữ liệu từ biến môi trường.
    {
        host: process.env.MYSQL_URL, // Địa chỉ máy chủ cơ sở dữ liệu từ biến môi trường.
        dialect: 'mysql',            // Loại cơ sở dữ liệu là MySQL.
        port: process.env.MYSQL_PORT || 3306, // Cổng kết nối cơ sở dữ liệu từ biến môi trường.
        logging: false, // Tắt logging của Sequelize.(Có thể bật lại nếu cần)
    },
);
// Khởi tạo một kết nối mới với cơ sở dữ liệu MySQL bằng Sequelize.
// Check các biến môi trường để lấy thông tin kết nối.
console.log("DB MYSQL_DB_NAME:", process.env.MYSQL_DB_NAME);
console.log("DB MYSQL_USERNAME:", process.env.MYSQL_USERNAME);
console.log("DB PASSWORD:", process.env.MYSQL_PASSWORD);
console.log("DB MYSQL_URL:", process.env.MYSQL_URL);
console.log("DB MYSQL_PORT:", process.env.MYSQL_PORT);

fs
    .readdirSync(__dirname) // Đọc danh sách tất cả các file trong thư mục hiện tại.
    .filter(file => {
        // Lọc ra các file thỏa mãn điều kiện:
        return (
            file.indexOf('.') !== 0 &&  // Loại bỏ các file ẩn (bắt đầu bằng `.`).
            file !== basename &&        // Loại bỏ file hiện tại (vd: index.js).
            file.slice(-3) === '.js'    // Chỉ giữ lại các file có đuôi `.js`.
        );
    })
    .forEach(file => {
        // Với mỗi file `.js` được lọc:
        console.log(`[🔄] Loading model from file: ${file}`);
        const model = require(path.join(__dirname, file))(sequelize);
        // Import file và gọi hàm để khởi tạo model với kết nối `sequelize`.

        db[model.name] = model;
        console.log(`[✅] Model ${model.name} loaded successfully`);
        // Lưu model vào đối tượng `db` với tên của model làm key.
    });

Object.keys(db).forEach(modelName => {
    // Duyệt qua các model trong `db`:
    if (db[modelName].associate) {
        // Nếu model có phương thức `associate` (dùng để định nghĩa quan hệ):
        db[modelName].associate(db);
        // Gọi `associate` và truyền toàn bộ models để thiết lập quan hệ.
    }
});

console.log('[📋] All loaded models:', Object.keys(db));

db.sequelize = sequelize;
// Lưu kết nối Sequelize vào đối tượng `db` để sử dụng trong ứng dụng.

db.Sequelize = Sequelize;
// Lưu lớp Sequelize vào đối tượng `db` (nếu cần sử dụng trực tiếp Sequelize trong ứng dụng).

module.exports = db;
// Xuất đối tượng `db`, bao gồm tất cả các model và kết nối cơ sở dữ liệu.
