'use client';

import { Typography, Divider } from 'antd';
import Link from 'next/link';
import '@/Views/Footer.scss';

const { Text } = Typography;

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Về Truyện Hoàn</h3>
                    <p>Website đọc truyện online hàng đầu với nội dung được cập nhật nhanh và liên tục. Đặc biệt website đọc hoàn toàn miễn phí, không quảng cáo và hoạt động phi lợi nhuận.</p>
                </div>

                <div className="footer-section">
                    <h3>Thể Loại</h3>
                    <div className="category-links">
                        <Link href="/truyen/tien-hiep">Tiên Hiệp</Link>
                        <Link href="/truyen/kiem-hiep">Kiếm Hiệp</Link>
                        <Link href="/truyen/ngon-tinh">Ngôn Tình</Link>
                        <Link href="/truyen/xuyen-khong">Xuyên Không</Link>
                        <Link href="/truyen/do-thi">Đô Thị</Link>
                        <Link href="/truyen/huyen-huyen">Huyền Huyễn</Link>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Liên Kết</h3>
                    <div className="footer-links">
                        <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
                        <Link href="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
                        <Link href="/quy-dinh-noi-dung">Quy định về nội dung</Link>
                        <Link href="/thoa-thuan-quyen-rieng-tu">Thỏa thuận quyền riêng tư</Link>
                    </div>
                </div>
            </div>

            <Divider />

            <div className="footer-bottom">
                <Text>© 2024 Truyện Hoàn. Tất cả quyền được bảo lưu.</Text>
                <Text>
                    Website hoạt động dưới Giấy phép truy cập mở Creative Commons Attribution 4.0 International License
                </Text>
            </div>
        </footer>
    );
};

export default Footer;
