import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import HeroStoryCarousel from "@/components/story/HeroStoryCarousel";
import LandscapeStoryCard from "@/components/story/LandscapeStoryCard";
import StorySection from "@/components/story/StorySection";
import { featuredGenres, getHomeCollections } from "@/lib/comic-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { hot, latest, tienHiep, kiemHiep } = await getHomeCollections();
  if (!hot.length && !latest.length) return <div className="screen-shell"><div className="app-container"><EmptyState /></div></div>;

  const recent = latest.length ? latest : hot;
  const coming = [...tienHiep, ...kiemHiep].filter((story, index, items) => items.findIndex((item) => item.id === story.id) === index);
  return (
    <div className="screen-shell home-screen">
      <div className="app-container home-dashboard">
        <main className="home-primary">
          <HeroStoryCarousel stories={hot} />
          <StorySection title="Recent Release" stories={recent.slice(0, 10)} href="/TruyenHot" />
          <StorySection title="Moi cap nhat" eyebrow="Coming Soon" stories={(coming.length ? coming : hot).slice(0, 10)} href="/TruyenTienHiep" />
        </main>

        <aside className="home-sidebar">
          <section className="sidebar-section">
            <header><h2 className="comic-heading">Trending</h2><Link href="/TruyenHot">Xem tat ca</Link></header>
            <div className="trending-list">{hot.slice(0, 6).map((story, index) => <LandscapeStoryCard story={story} rank={index + 1} key={story.id} />)}</div>
          </section>
          <section className="sidebar-section genre-sidebar">
            <header><h2 className="comic-heading">Genres</h2><Link href="/genres">Kham pha</Link></header>
            <div>{featuredGenres.slice(1).map((genre) => <Link href={`/genres/${genre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-")}`} key={genre}>{genre}</Link>)}</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
