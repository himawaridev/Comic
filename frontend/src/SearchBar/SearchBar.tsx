import { Tooltip, Link, SearchOutlined, axios, useState, useEffect, Flex, Spin } from '@/lib/Export_lib'

// Import scss and any:
import "@/Views/SearchBar.scss";

interface TruyenTienHiepComponentType {
    id: number;
    Slug: string;
    ImageLinks: string;
    Title: string;
    LinkComic: string;
    Author: string;
    Chapters: string;
    createdAt: string;
    updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Set API URL
const PAGE_SIZE = 25; // Set item quantity per page

const SearchBar: React.FC = () => {
    const [data, setData] = useState<TruyenTienHiepComponentType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const fetchData = (page: number) => {
        setIsLoading(true);
        axios.get(`${API_BASE_URL}/getTruyenTienHiepController?page=${page}&limit=${PAGE_SIZE}`)
            .then((response) => {
                console.log("API Response:", response.data);
                if (response.data && Array.isArray(response.data.TruyenTienHiepController)) {
                    setData(response.data.TruyenTienHiepController);
                    setTotalItems(response.data.total || 0); // Tổng số truyện
                } else {
                    setError("Dữ liệu không hợp lệ!");
                }
            })
            .catch((error) => {
                console.error("API Error:", error.message);
                setError("Không thể tải dữ liệu!");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Hàm render trạng thái loading / error / không có dữ liệu
    const renderStatus = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" style={{ height: '100px', cursor: 'pointer' }}>
                    <Spin size="small" />
                </Flex>
            );
        }
        if (error) {
            return (
                <Flex justify="center" align="center" style={{ height: '100px', cursor: 'pointer' }}>
                    <Spin size="small" />
                    <Tooltip title="Đến trang hỗ trợ nhanh">
                        <Link href="/HoTroNhanh" style={{ marginLeft: '25px', color: '#1890ff', fontSize: '13px' }}>{error}</Link>
                    </Tooltip>
                </Flex>
            );
        }
        if (!isLoading && !error && data.length === 0) {
            return (
                <Flex justify="center" align="center" style={{ height: '100px', cursor: 'pointer' }}>
                    <Spin size="small" />
                    <Link href="/HoTroNhanh" style={{ marginLeft: '25px', color: '#1890ff', fontSize: '13px' }}>Không có dữ liệu!</Link>
                </Flex>
            );
        }
        return null;
    };

    return (
        <main id="SearchBar">
            <div>
                <div className="SearchBar-container">
                    <div className="SearchBar-input">
                        <SearchOutlined className="SearchBar-input-icon" />
                        <input className="SearchBar-input-text" type="text" placeholder="Tìm kiếm..." />
                    </div>
                </div>
                {renderStatus()}
                {!isLoading && !error && data.length > 0 && (
                    <div className="ListComic">
                        <div className='ListComicContainer'>
                            {data.slice(0, 5).map((comic) => (
                                <div key={comic.id} className='ListComicItem'>
                                    <Link href={comic.LinkComic} className='ListComicItemLink'>
                                        {comic.Title}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
export default SearchBar;