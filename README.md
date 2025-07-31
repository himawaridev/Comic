# COMIC - Web Application

Ứng dụng web đọc truyện được xây dựng với Next.js frontend và Node.js backend, hỗ trợ web scraping và real-time updates.

## 🚀 Quick Start với Docker

### Yêu cầu hệ thống
- Docker
- Docker Compose

### Cài đặt và chạy

1. **Clone repository**
```bash
git clone <repository-url>
cd Comic
```

2. **Chạy với Docker (Production)**
```bash
# Sử dụng script tự động
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh prod

# Hoặc chạy thủ công
docker-compose up --build -d
```

3. **Chạy với Docker (Development)**
```bash
# Sử dụng script tự động
./scripts/docker-setup.sh dev

# Hoặc chạy thủ công
docker-compose -f docker-compose.dev.yml up --build -d
```

4. **Truy cập ứng dụng**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Nginx (nếu bật): http://localhost:80

## 🛠️ Cấu trúc dự án

```
Comic/
├── frontend/                 # Next.js frontend
├── backend/                  # Node.js backend
├── docker-compose.yml        # Production Docker setup
├── docker-compose.dev.yml    # Development Docker setup
├── Dockerfile.backend        # Backend Docker image
├── Dockerfile.frontend       # Frontend Docker image
├── nginx/                    # Nginx configuration
├── mysql/                    # MySQL initialization
└── scripts/                  # Setup scripts
```

## 🔧 Cấu hình

### Environment Variables
Copy file `env.example` thành `.env` và cấu hình:

```bash
cp env.example .env
```

Các biến môi trường chính:
- `MYSQL_DB_NAME`: Tên database
- `MYSQL_USERNAME`: Username MySQL
- `MYSQL_PASSWORD`: Password MySQL
- `PORT_SERVER_RUN`: Port backend
- `NEXT_PUBLIC_API_URL`: URL API cho frontend

## 📊 Services

### Production Stack
- **Frontend**: Next.js trên port 3000
- **Backend**: Node.js/Express trên port 8000
- **Database**: MySQL 8.0
- **Reverse Proxy**: Nginx (optional)
- **Real-time**: Socket.IO

### Development Stack
- **Frontend**: Next.js với hot reload
- **Backend**: Node.js với nodemon
- **Database**: MySQL 8.0
- **Volume mounting**: Source code được mount để hot reload

## 🐳 Docker Commands

### Quản lý containers
```bash
# Khởi động services
docker-compose up -d

# Dừng services
docker-compose down

# Xem logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild images
docker-compose up --build -d
```

### Development
```bash
# Khởi động development environment
docker-compose -f docker-compose.dev.yml up -d

# Xem logs development
docker-compose -f docker-compose.dev.yml logs -f
```

### Database
```bash
# Truy cập MySQL
docker exec -it comic_mysql mysql -u comic_user -p

# Backup database
docker exec comic_mysql mysqldump -u comic_user -p comic > backup.sql

# Restore database
docker exec -i comic_mysql mysql -u comic_user -p comic < backup.sql
```

## 🔍 Monitoring

### Health Checks
- Backend: http://localhost:8000/health
- Frontend: http://localhost:3000/api/health
- Nginx: http://localhost/health

### Logs
```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

## 🚀 Deployment

### Production Deployment
1. Cấu hình environment variables
2. Build và chạy containers:
```bash
docker-compose up --build -d
```

### Development Deployment
1. Cấu hình environment variables
2. Chạy development environment:
```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

## 🔒 Security

### Nginx Security Headers
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy

### Rate Limiting
- API: 10 requests/second
- Frontend: 30 requests/second

## 📝 Troubleshooting

### Common Issues

1. **Port conflicts**
```bash
# Kiểm tra ports đang sử dụng
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000
```

2. **Database connection issues**
```bash
# Kiểm tra MySQL container
docker exec comic_mysql mysqladmin ping -h localhost
```

3. **Permission issues**
```bash
# Fix permissions
sudo chown -R $USER:$USER .
```

### Logs Analysis
```bash
# Xem logs lỗi
docker-compose logs --tail=100 | grep ERROR

# Xem logs real-time
docker-compose logs -f --tail=50
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

ISC License