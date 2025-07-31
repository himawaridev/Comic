'use client';
import { EffectLoading, RenderListTruyen, RenderTypeTruyen, useLoading } from '@/app/components';

// Import scss and any:
import "@/Views/page.scss";

const TruyenQuanTruong: React.FC = () => {
    const isLoading = useLoading();

    if (isLoading) {
        return (
            <EffectLoading size='large' />
        )
    }

    return (
        <main id="Truyen" className='TruyenQuanTruong'>
            <RenderListTruyen
                title="TRUYỆN QUAN TRƯỜNG"
                apiEndpoint="http://localhost:8000/getTruyenQuanTruongController"
            />
            <RenderTypeTruyen />
        </main>
    )
}
export default TruyenQuanTruong;