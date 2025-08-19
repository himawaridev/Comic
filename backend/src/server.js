const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./Model');
const http = require('http');

// Import Services:
const { initServices } = require('./Check');

// Loading environment variables from file .env:
const dotenv = require('dotenv');
dotenv.config();
console.log("DB USER server:", process.env.PORT_SERVER_RUN); // Kiểm tra xem biến có được đọc không

// Import unified router from Router:
const TruyenRouterUnified = require('./Router/TruyenRouterUnified');

// ------------------------ Use app ------------------------ //
app.use(cors());
app.use(express.json());

// ------------------------ Use unified router ------------------------ //
app.use('/', TruyenRouterUnified);

// ------------------------ Khởi động Server ------------------------ //
const startServer = async () => {
    try {
        try {
            await sequelize.authenticate();
            console.log("[✅ Database connected successfully]");
        } catch (error) {
            console.error("[❌ Database connection failed]", error.message);
            process.exit(1); // Dừng server nếu kết nối thất bại
        }

        try {
            await sequelize.sync(); // Đồng bộ cơ sở dữ liệu
            console.log("[✅ Database synced successfully]");
            console.log("[🔄 Initializing services...]");
        } catch (error) {
            console.error("[❌ Database sync failed:", error.message);
            process.exit(1); // Dừng server nếu đồng bộ thất bại
        }

        console.log('-----------------------------------------------------------------------');

        // ----- Run servies:
        try {
            await initServices();
            console.log("[✅ Services] initialized successfully: Check.js");
        } catch (error) {
            console.error("[❌ Services] initialization failed:", error.message);
            process.exit(1);
        }

        //------------------------------ Start server ------------------------------//
        const PORT = process.env.PORT_SERVER_RUN || 8000;
        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log('-----------------------------------------------------------------------');
            console.log(`[🚀 Server] is running on port ${PORT}`);
        });

        // Xử lý khi server đóng
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
            });
        });

    }
    catch (error) {
        console.error("[❌ Server startup failed]:", error.message);
        process.exit(1);
    }
};

startServer();

