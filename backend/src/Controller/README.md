# Controller Unified - Hướng dẫn sử dụng

## Tổng quan

File `TruyenControllerUnified.js` đã được tạo để thay thế tất cả các controller riêng biệt:
- `TruyenHotController.js`
- `TruyenKiemHiepController.js`
- `TruyenTienHiepController.js`
- `TruyenMoiCapNhatController.js`
- `TruyenQuanTruongController.js`
- `TheLoaiTruyenController.js`

## Cấu trúc

### 1. Generic Controller Function
```javascript
const getTruyenController = async (req, res, modelName, responseKey)
```
- Function chung cho tất cả các loại truyện
- Hỗ trợ pagination với `page` và `limit` parameters
- Tự động sắp xếp theo `id` ASC

### 2. Specific Controllers
Mỗi controller cụ thể gọi generic function với tham số tương ứng:
- `getTruyenHotController`
- `getTruyenKiemHiepController`
- `getTruyenTienHiepController`
- `getTruyenMoiCapNhatController`
- `getTruyenQuanTruongController`
- `getTheLoaiTruyenController` (không có pagination)

### 3. Helper Functions
```javascript
const getModelByName = (modelName)
```
- Lấy model theo tên
- Hỗ trợ validation

## Lợi ích

1. **Giảm code trùng lặp**: Từ ~150 dòng xuống ~100 dòng
2. **Dễ bảo trì**: Chỉ cần sửa 1 chỗ thay vì 6 file
3. **Tính nhất quán**: Tất cả controller có cùng logic
4. **Dễ mở rộng**: Thêm loại truyện mới chỉ cần thêm vào `getModelByName`

## Cách thêm loại truyện mới

1. Import model mới trong phần import
2. Thêm vào object `models` trong `getModelByName`
3. Tạo controller function mới
4. Export controller function

## API Endpoints

Tất cả endpoints vẫn giữ nguyên:
- `GET /getTruyenHotController`
- `GET /getTruyenKiemHiepController`
- `GET /getTruyenTienHiepController`
- `GET /getTruyenMoiCapNhatController`
- `GET /getTruyenQuanTruongController`
- `GET /getTheLoaiTruyenController`

## Query Parameters

- `page`: Số trang (mặc định: 1)
- `limit`: Số bản ghi mỗi trang (mặc định: 10)

## Response Format

```json
{
  "TruyenHotController": [...],
  "total": 100
}
```
