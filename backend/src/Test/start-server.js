const http = require('http');
const net = require('net');

// Kiểm tra port có đang được sử dụng không
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.once('close', () => {
                resolve(false);
            });
            server.close();
        });
        server.on('error', () => {
            resolve(true);
        });
    });
}

// Tìm port tự do
async function findFreePort(startPort) {
    let port = startPort;
    while (await isPortInUse(port)) {
        port++;
        if (port > startPort + 100) {
            throw new Error('Không tìm thấy port tự do');
        }
    }
    return port;
}

// Khởi động server
async function startServer() {
    try {
        console.log('🔍 Đang kiểm tra port 8000...');

        if (await isPortInUse(8000)) {
            console.log('⚠️  Port 8000 đang được sử dụng');
            console.log('🔄 Đang tìm port tự do...');

            const freePort = await findFreePort(8001);
            console.log(`✅ Tìm thấy port tự do: ${freePort}`);

            // Set environment variable
            process.env.PORT_SERVER_RUN = freePort;
            console.log(`📝 Đã set PORT_SERVER_RUN=${freePort}`);
        } else {
            console.log('✅ Port 8000 có sẵn');
        }

        console.log('🚀 Khởi động server...');

        // Import và khởi động server
        require('../server.js');

    } catch (error) {
        console.error('❌ Lỗi khởi động server:', error.message);
        process.exit(1);
    }
}

module.exports = {
    startServer
}