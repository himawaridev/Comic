import Link from "next/link";
import { BookOpen, Play, Star } from "lucide-react";
import { Story } from "@/lib/comic-data";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function HeroStoryCarousel({ stories }: { stories: Story[] }) {
  return (
    <section className="popular-block">
      <div className="popular-block__heading">
        <div>
          <span>Doc nhieu nhat</span>
          <h1 className="comic-heading">Most Popular</h1>
        </div>
        <Link href="/TruyenHot">Xem tat ca</Link>
      </div>
      <div className="hero-story-rail">
        {stories.slice(0, 5).map((story, index) => (
          <Link className="hero-story-card" href={`/stories/${story.slug}`} key={story.id}>
            <div className="hero-story-card__media">
              <ImageWithFallback src={story.coverUrl} alt={story.title} fill priority={index === 0} sizes="(max-width: 899px) 132px, 240px" />
              <span>Top {String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="hero-story-card__content">
              <span className="hero-story-card__genre">{story.genres[0] || "Truyen chu"}</span>
              <h2>{story.title}</h2>
              <div className="hero-story-card__meta"><span><Star size={16} fill="currentColor" /> {story.rating.toFixed(1)}</span><span><BookOpen size={16} /> {story.totalChapters} chuong</span></div>
              <span className="hero-story-card__read"><Play size={15} fill="currentColor" /> Doc ngay</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
