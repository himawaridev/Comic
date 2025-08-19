'use client'
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import clsx from "clsx";
import { Link, Flex, Spin, Dropdown, Space, Typography, message, FireTwoTone } from "@/lib/Export_lib";

// Import scss and any:
import "@/Views/Carousel.scss";

interface Comic {
    id: number;
    Slug: string;
    ImageLinks: string;
    NameComic: string;
    LinkComic: string;
    Description?: string;
    Author?: string;
    Status?: string;
}

type CategoryType = 'hot' | 'tien-hiep' | 'kiem-hiep';

const API_BASE_URL = process.env.PORT_API || 'http://localhost:8000'; // Set API URL
const PAGE_SIZE = 13; // Set item quantity per page

const Carousel = () => {
    const [data, setData] = useState<Comic[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<CategoryType>('hot');
    const [messageApi, contextHolder] = message.useMessage();

    const fetchData = useCallback(async (category: CategoryType) => {
        setIsLoading(true);
        setError(null);

        let apiUrl = '';
        switch (category) {
            case "tien-hiep":
                apiUrl = `${API_BASE_URL}/getTruyenTienHiepController?page=1&limit=${PAGE_SIZE}`;
                break;
            case "kiem-hiep":
                apiUrl = `${API_BASE_URL}/getTruyenKiemHiepController?page=1&limit=${PAGE_SIZE}`;
                break;
            default:
                apiUrl = `${API_BASE_URL}/getTruyenHotController?page=1&limit=${PAGE_SIZE}`;
        }

        try {
            const { data: responseData } = await axios.get(apiUrl);
            const comicData = responseData.TruyenTienHiepController ||
                responseData.TruyenKiemHiepController ||
                responseData.TruyenHotController;

            if (Array.isArray(comicData)) {
                setData(comicData);
            } else {
                throw new Error("Invalid data structure received from API");
            }
        } catch (err) {
            console.error("Error fetching data: ", err);
            setError(err instanceof Error ? err.message : "Không thể tải dữ liệu từ server. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch data
    useEffect(() => {
        fetchData(category);
    }, [category, fetchData]);

    const handleCategoryChange = useCallback((newCategory: CategoryType) => {
        setCategory(newCategory);
    }, []);

    // Hàm render trạng thái loading / error / không có dữ liệu
    const renderStatus = () => {
        if (isLoading) {
            return (
                <Flex justify="center" align="center" style={{ height: '520px', cursor: 'pointer' }}>
                    <Spin size="default" />
                </Flex>
            );
        }
        if (error) {
            return (
                <Flex justify="center" align="center" style={{ height: '520px', cursor: 'pointer' }}>
                    <Spin size="default" />
                    <Link href="/HoTroNhanh" style={{ marginLeft: '25px', color: '#1890ff', fontSize: '13px' }}>{error}</Link>
                </Flex>
            );
        }
        if (!isLoading && !error && data.length === 0) {
            return (
                <Flex justify="center" align="center" style={{ height: '520px', cursor: 'pointer' }}>
                    <Spin size="default" />
                    <Link href="/HoTroNhanh" style={{ marginLeft: '25px', color: '#1890ff', fontSize: '13px' }}>Không có dữu liệu!</Link>
                </Flex>
            );
        }
        return null;
    };

    return (
        <div id="Carousel">
            {contextHolder}
            <div className="CarouselHeader">
                <Header setCategory={handleCategoryChange} currentCategory={category} />
            </div>
            {renderStatus()}
            <div className="THCC">
                <div className="WrapperTHCC">
                    {data.map((item, index) => (
                        <div key={item.id} className={clsx("CarouselContent", {
                            "first-item": index === 0,
                            "seventh-item": index === 7
                        })}>
                            <Link href={item.LinkComic}>
                                <Image
                                    src={item.ImageLinks}
                                    width={index === 0 ? 258 : 129}
                                    height={index === 0 ? 394 : 192}
                                    alt={item.NameComic || "Comic image"}
                                    className="CarouselImages"
                                    loading={index < 4 ? "eager" : "lazy"}
                                    priority={index === 0}
                                />
                                <div className="CarouselName">{item.NameComic}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface HeaderProps {
    setCategory: (category: CategoryType) => void;
    currentCategory: CategoryType;
}

const Header = ({ setCategory, currentCategory }: HeaderProps) => {
    const categoryMap: Record<CategoryType, string> = {
        'hot': 'TẤT CẢ',
        'tien-hiep': 'TIÊN HIỆP',
        'kiem-hiep': 'KIẾM HIỆP'
    };

    const handleMenuClick = useCallback((key: string) => {
        const categoryMap: Record<string, CategoryType> = {
            '1': 'hot',
            '2': 'tien-hiep',
            '3': 'kiem-hiep'
        };
        const newCategory = categoryMap[key];
        if (newCategory && newCategory !== currentCategory) {
            setCategory(newCategory);
        }
    }, [setCategory, currentCategory]);

    const menuItems = useMemo(() => [
        { key: '1', label: 'TẤT CẢ', onClick: () => handleMenuClick('1') },
        { key: '2', label: 'TIÊN HIỆP', onClick: () => handleMenuClick('2') },
        { key: '3', label: 'KIẾM HIỆP', onClick: () => handleMenuClick('3') }
    ], [handleMenuClick]);

    const getSelectedKey = useCallback(() => {
        const keyMap: Record<CategoryType, string> = {
            'hot': '1',
            'tien-hiep': '2',
            'kiem-hiep': '3'
        };
        return [keyMap[currentCategory]];
    }, [currentCategory]);

    return (
        <div className="CarouselTitle">
            <div className="TitleNameBanner">
                <Link href="/TruyenHot" className="TitleName">TRUYỆN HOT <FireTwoTone className="FireTwoTone" /></Link>
                <Dropdown
                    menu={{
                        items: menuItems,
                        selectable: true,
                        selectedKeys: getSelectedKey(),
                    }}
                >
                    <Typography.Link>
                        <Space style={{ color: 'rgb(78, 78, 78)' }}>
                            {categoryMap[currentCategory]}
                        </Space>
                    </Typography.Link>
                </Dropdown>
            </div>
        </div>
    );
};

export default Carousel;


