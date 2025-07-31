'use client'
import HoTroNhanhComponent from "./HoTroNhanhComponent";
import { EffectLoading, useLoading } from '@/app/components';

// Import scss and any:
import "@/Views/PageHoTroNhanh.scss";


const HoTroNhanh = () => {
    const isLoading = useLoading();

    if (isLoading) {
        return (
            <EffectLoading size='large' />
        )
    }

    return (
        <main id="HoTroNhanh">
            <div className="HoTroNhanhContent">
                <HoTroNhanhComponent />
            </div>
        </main>
    )
}

export default HoTroNhanh;