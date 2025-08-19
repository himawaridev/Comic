# Router Unified - Hướng dẫn sử dụng

## Tổng quan

File `TruyenRouterUnified.js` đã được tạo để thay thế tất cả các router riêng biệt:
- `TruyenHotRouter.js`
- `TruyenKiemHiepRouter.js`
- `TruyenTienHiepRouter.js`
- `TruyenMoiCapNhatRouter.js`
- `TruyenQuanTruongRouter.js`
- `TheLoaiTruyenRouter.js`

## Cấu trúc

### 1. Basic Routes
Tất cả các route cơ bản được định nghĩa:
```javascript
router.get('/getTruyenHotController', getTruyenHotController);
router.get('/getTruyenKiemHiepController', getTruyenKiemHiepController);
// ... các route khác
```

### 2. Advanced Routes

#### Route tổng hợp
```javascript
GET /getAllTruyen?types=hot,kiemhiep,tienhiep
```
- Lấy nhiều loại truyện cùng lúc
- Parameter `types`: danh sách loại truyện (phân cách bằng dấu phẩy)
- Mặc định lấy tất cả loại truyện

#### Route thông tin
```javascript
GET /truyen-types
```
- Trả về danh sách các loại truyện có sẵn
- Bao gồm tên, route và mô tả

## Lợi ích

1. **Giảm code trùng lặp**: Từ ~80 dòng xuống ~60 dòng
2. **Dễ bảo trì**: Chỉ cần sửa 1 chỗ thay vì 6 file
3. **Tính nhất quán**: Tất cả route có cùng pattern
4. **Tính năng mới**: Thêm route tổng hợp và route thông tin

## API Endpoints

### Basic Endpoints
- `GET /getTruyenHotController` - Lấy truyện hot
- `GET /getTruyenKiemHiepController` - Lấy truyện kiếm hiệp
- `GET /getTruyenTienHiepController` - Lấy truyện tiên hiệp
- `GET /getTruyenMoiCapNhatController` - Lấy truyện mới cập nhật
- `GET /getTruyenQuanTruongController` - Lấy truyện quan trường
- `GET /getTheLoaiTruyenController` - Lấy thể loại truyện

### Advanced Endpoints
- `GET /getAllTruyen` - Lấy tất cả loại truyện
- `GET /truyen-types` - Lấy thông tin các loại truyện

## Query Parameters

### Cho Basic Endpoints
- `page`: Số trang (mặc định: 1)
- `limit`: Số bản ghi mỗi trang (mặc định: 10)

### Cho getAllTruyen
- `types`: Danh sách loại truyện (phân cách bằng dấu phẩy)
  - Ví dụ: `?types=hot,kiemhiep,tienhiep`
  - Mặc định: tất cả loại truyện

## Response Examples

### Basic Response
```json
{
  "TruyenHotController": [...],
  "total": 100
}
```

### getAllTruyen Response
```json
{
  "hot": {
    "TruyenHotController": [...],
    "total": 50
  },
  "kiemhiep": {
    "TruyenKiemHiepController": [...],
    "total": 30
  }
}
```

### truyen-types Response
```json
{
  "message": "Available truyen types",
  "types": [
    {
      "name": "TruyenHot",
      "route": "/getTruyenHotController",
      "description": "Truyện hot được yêu thích"
    }
  ],
  "total": 6
}
```

## Cách thêm route mới

1. Import controller mới từ `TruyenControllerUnified`
2. Thêm route mới vào router
3. Cập nhật route `/truyen-types` nếu cần

## Migration từ Router cũ

Để chuyển từ router cũ sang unified:
1. Thay thế import trong `server.js`
2. Xóa các file router cũ (tùy chọn)
3. Test lại tất cả endpoints
