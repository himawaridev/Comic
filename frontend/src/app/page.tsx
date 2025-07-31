'use client'
import Carousel from '@/Carousel/Carousel';
import SearchBar from '@/SearchBar/SearchBar';
import { EffectLoading, useLoading } from '@/app/components';

// Import scss and any:
import "@/app/page.scss";

const HomePage = () => {
    const isLoading = useLoading();

    if (isLoading) {
        return (
            <EffectLoading size='large' />
        )
    }

    return (
        <main id="HomePage">
            <Carousel />
            <SearchBar />
        </main>
    );
};

export default HomePage;